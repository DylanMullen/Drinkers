package pirate

import (
	"encoding/json"
	"math/rand"
	"time"

	"drinkers.beer/waterfall/gamemodes/pirate/errors"
	"drinkers.beer/waterfall/gamemodes/pirate/models"
	"drinkers.beer/waterfall/websockets"
)

const (
	PROMPTS = 5
)

type PirateGame struct {
	socket         *websockets.SocketHub
	settings       models.PirateSettings
	currentPlayer  string
	turns          int
	players        []*models.PiratePlayer
	currentPrompts []models.PiratePrompt
	prompts        []models.PiratePrompt
}

func (game *PirateGame) Init(player models.PiratePlayer) {
	game.settings.Started = false
	game.settings.ShouldDie = false

	game.players = make([]*models.PiratePlayer, 0)
	game.players = append(game.players, &player)
	game.currentPlayer = game.players[0].UUID
	game.turns = 1

	game.shuffle()

	for i := 0; i <= 5; i++ {
		game.newPrompt(false)
	}
}

func (game *PirateGame) shuffle() {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(game.prompts), func(i, j int) {
		(game.prompts)[i], (game.prompts)[j] = (game.prompts)[j], (game.prompts)[i]
	})
}

func (game *PirateGame) resetPrompts() {
	game.prompts = GetPiratePrompts(game.settings.Packs)
	game.shuffle()
}

func (game *PirateGame) addPlayer(player models.PiratePlayer) {
	if game.hasPlayer(player.UUID) {
		return
	}

	game.players = append(game.players, &player)

	if len(game.players) > 0 {

		response, _ := json.Marshal(models.Response{
			ID: 1,
			Content: models.JoinResponse{
				Player:     player,
				Current:    game.currentPlayer,
				NextPlayer: game.getNextPlayer(),
			},
		})

		game.socket.BroadcastMessage("", response)
	}
}

func (game *PirateGame) removePlayer(uuid string) {
	if !game.hasPlayer(uuid) {
		return
	}
	players := make([]*models.PiratePlayer, len(game.players)-1)

	for i := 0; i < len(game.players); i++ {
		if game.players[i].UUID == uuid {
			continue
		}
		players = append(players, game.players[i])
	}
	game.players = players

	if len(game.players) >= 1 {
		response, _ := json.Marshal(models.Response{
			ID:      2,
			Content: models.RemovePlayerResponse{UUID: uuid},
		})
		game.socket.BroadcastMessage("", response)
	}
}

func (game PirateGame) getPlayer(uuid string) (player models.PiratePlayer, err error) {
	for _, v := range game.players {
		if v.UUID == uuid {
			player = *v
			return
		}
	}
	err = errors.PlayerNotFound{UUID: uuid}
	return
}

func (game PirateGame) hasPlayer(uuid string) bool {
	_, err := game.getPlayer(uuid)
	return err == nil
}

func (game PirateGame) getPlayerIndex(uuid string) int {
	for index, v := range game.players {
		if v.UUID == uuid {
			return index
		}
	}
	return -1
}

func (game PirateGame) getNextPlayer() string {
	currentIndex := game.getPlayerIndex(game.currentPlayer)

	if currentIndex == 0 && len(game.players) == 1 {
		return game.players[0].UUID
	}

	if currentIndex+1 > len(game.players)-1 {
		return game.players[0].UUID
	}
	return game.players[currentIndex+1].UUID
}

func (game *PirateGame) nextTurn() {
	prompt := game.newPrompt(true)

	game.currentPlayer = game.getNextPlayer()
	nextPlayer := game.getNextPlayer()

	response, _ := json.Marshal(models.Response{
		ID: 3,
		Content: models.NextTurnResponse{
			Current:    game.currentPlayer,
			NextPlayer: nextPlayer,
			Prompt:     prompt,
			Turns:      game.turns,
		},
	})

	game.turns = game.turns + 1

	game.socket.BroadcastMessage("", response)
}

func (game *PirateGame) newPrompt(delete bool) models.PiratePrompt {
	if len(game.prompts) == 0 {
		game.resetPrompts()
	}

	prompt := game.prompts[0]
	game.prompts = game.prompts[1:]

	game.currentPrompts = append(game.currentPrompts, prompt)
	if delete {
		game.currentPrompts = game.currentPrompts[1:]
	}

	return prompt
}

func (game *PirateGame) Run() {
	h := game.socket
	for {
		if game.settings.ShouldDie {
			break
		}

		select {
		case client := <-h.Register:

			h.Clients[client] = true
			// game.mu.Lock()

			player, err := game.getPlayer(client.UUID)

			if err == nil {
				player.Disconnected = false
			}

			// game.mu.Unlock()

		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
			}

			// game.mu.Lock()
			player, err := game.getPlayer(client.UUID)
			if err == nil {
				player.Disconnected = true
				player.DisconnectTime = time.Now()
			}
			// game.mu.Unlock()

		case userMessage := <-h.Broadcast:
			var data map[string][]byte
			json.Unmarshal(userMessage, &data)

			// game.mu.Lock()
			game.handleMessage(string(data["id"]), data["message"])
			// game.mu.Unlock()
		}
	}
}

func (game PirateGame) ToGameJSON() models.GameJSON {
	return models.GameJSON{
		Prompts: game.toPromptsJSON(),
		Turns:   game.turns,
		Players: game.toPlayerJSON(),
	}
}

func (game *PirateGame) toPromptsJSON() map[int]models.PiratePrompt {
	response := make(map[int]models.PiratePrompt, 0)

	for i := len(game.currentPrompts) - 1; i > 0; i-- {
		prompt := game.currentPrompts[i]
		response[i] = prompt
	}

	return response
}

func (game PirateGame) toPlayerJSON() models.PlayersJSON {

	users := make(map[int]models.PiratePlayer)

	for index, v := range game.players {
		users[index] = *v
	}

	response := models.PlayersJSON{
		Current: game.currentPlayer,
		Next:    game.getNextPlayer(),
		Users:   users,
	}

	return response
}
