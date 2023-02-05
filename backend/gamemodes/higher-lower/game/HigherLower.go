package game

import (
	"encoding/json"
	"math/rand"

	"drinkers.beer/waterfall/gamemodes/higher-lower/models"
	"drinkers.beer/waterfall/gamemodes/pirate/errors"
	"drinkers.beer/waterfall/websockets"
)

type HigherLower struct {
	socket   *websockets.SocketHub
	Settings models.GameSettings `json:"settings"`
	GamePlay models.Gameplay     `json:"gameplay"`
}

func (game *HigherLower) Init() {
	game.GamePlay = models.Gameplay{}
	game.start()
}

func (game *HigherLower) start() {
	game.GamePlay.HasStarted = true
}

func (game *HigherLower) stop() {
	game.GamePlay.HasStarted = false
}

func (game *HigherLower) nextTurn(action string) {
	nextNum := game.newNumber()

	if action == "higher" && nextNum >= game.GamePlay.CurrentNumber {
		game.GamePlay.CurrentNumber = nextNum
		game.GamePlay.CurrentStreak = game.GamePlay.CurrentStreak + 1
	} else {
		game.nextPlayer()
		game.GamePlay.CurrentNumber = game.newNumber()
		game.GamePlay.CurrentStreak = 0
	}

	//TODO send

	res, err := json.Marshal(models.NextTurnResponse{
		Player:        game.GamePlay.Players.CurrentPlayer,
		CurrentNumber: game.GamePlay.CurrentNumber,
		Streak:        game.GamePlay.CurrentStreak,
	})

	if err != nil {
		return
	}

	game.socket.BroadcastMessage("", res)
}

func (game *HigherLower) newNumber() int {
	min, max := game.getMaxNumber()
	return rand.Intn(max-min) + min
}

func (game *HigherLower) nextPlayer() {
	game.GamePlay.Players.CurrentPlayer = game.GamePlay.Players.Players[game.getNextPlayerIndex()]
}

func (game *HigherLower) AddPlayer(player models.HigherLowerPlayer) {
	if game.isPlayer(player.UUID) {
		return
	}
	game.GamePlay.Players.Players = append(game.GamePlay.Players.Players, player)

	if len(game.GamePlay.Players.Players) > 0 {

		response, _ := json.Marshal(models.Response{
			ID: 1,
			Content: models.JoinResponse{
				Player:     player,
				Current:    game.GamePlay.Players.CurrentPlayer.UUID,
				NextPlayer: game.GamePlay.Players.Players[game.getNextPlayerIndex()].UUID,
			},
		})

		game.socket.BroadcastMessage("", response)
	}
}

func (game HigherLower) isPlayer(uuid string) bool {
	_, err := game.getPlayer(uuid)

	return err != nil
}

func (game HigherLower) getPlayer(uuid string) (player models.HigherLowerPlayer, err error) {
	for i := 0; i < len(game.GamePlay.Players.Players); i++ {
		temp := game.GamePlay.Players.Players[i]
		if temp.UUID == uuid {
			player = temp
			return
		}
	}
	err = errors.PlayerNotFound{
		UUID: uuid,
	}
	return
}

func (game HigherLower) getPlayerIndex(uuid string) (pos int, err error) {
	for i := 0; i < len(game.GamePlay.Players.Players); i++ {
		temp := game.GamePlay.Players.Players[i]
		if temp.UUID == uuid {
			pos = i
			return
		}
	}
	err = errors.PlayerNotFound{
		UUID: uuid,
	}

	return
}

func (game HigherLower) getNextPlayerIndex() int {
	currentIndex, err := game.getPlayerIndex(game.GamePlay.Players.CurrentPlayer.UUID)
	if err != nil {
		return 0
	}
	if (currentIndex + 1) > len(game.GamePlay.Players.Players) {
		return 0
	} else {
		return currentIndex + 1
	}
}

func (game HigherLower) getMaxNumber() (min int, max int) {
	min, max = 0, 0
	switch game.Settings.GameType {
	case models.CARD:
		max = 12
		break
	case models.DICE:
		max = 6
		break
	}

	return
}

func (game *HigherLower) HandleSocket() {
	h := game.socket
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			// game.mu.Lock()

		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
			}
		case userMessage := <-h.Broadcast:

			var data map[string][]byte
			json.Unmarshal(userMessage, &data)

			game.handleMessage(string(data["id"]), data["message"])

		}
	}
}
