package game

import (
	"encoding/json"
	"sync"
	"time"

	"drinkers.beer/waterfall/cards"
	"drinkers.beer/waterfall/player"
	"drinkers.beer/waterfall/websockets"
)

type WaterfallGame struct {
	mu sync.RWMutex

	Uuid          string     `json:"uuid"`
	Owner         string     `json:"owner"`
	CurrentPlayer string     `json:"current"`
	NextPlayer    int        `json:"next"`
	Card          cards.Card `json:"card"`

	ReadyPlayers []string                  `json:"readyPlayers"`
	SkipPlayers  []string                  `json:"skips"`
	Players      []*player.WaterfallPlayer `json:"players"`

	Dates []WaterfallDate `json:"dates"`
	Rules []WaterfallRule `json:"rules"`

	Started   bool                  `json:"-"`
	ShouldDie bool                  `json:"-"`
	SocketHub *websockets.SocketHub `json:"-"`
	Deck      cards.Deck            `json:"-"`
	Settings  WaterfallSettings     `json:"-"`

	CardRules []byte `json:"-"`
}

type WaterfallDate struct {
	Owner string `json:"owner"`
	Date  string `json:"date"`
}

type WaterfallRule struct {
	UUID        string `json:"uuid"`
	Owner       string `json:"creator"`
	Description string `json:"rule"`
}

func (game *WaterfallGame) Start() {
	game.Card = *game.Deck.Pop(game.CurrentPlayer, game.Settings.Actions)

	current := game.CurrentPlayer
	game.IncrementNextPlayer(true)
	next := game.CurrentPlayer

	response, _ := json.Marshal(websockets.NextCardResponse{
		Response: websockets.Response{
			Action: 21,
			Sent:   time.Now(),
		},
		Card: websockets.CardResponse{
			Card:      game.Card,
			CardsLeft: len(game.Deck.Cards),
		}, PlayerResponse: websockets.NextPlayerResponse{
			Current:    current,
			NextPlayer: next,
		},
	})

	game.Started = true
	game.ReadyPlayers = make([]string, 0)

	game.SocketHub.BroadcastMessage("", response)
}

func (game *WaterfallGame) Init() {
	game.Deck = cards.CreateDeck(true)
	game.CurrentPlayer = game.Players[0].Uuid
	game.NextPlayer = 0
	game.IncrementNextPlayer(false)

	game.Dates = make([]WaterfallDate, 0)
	game.Rules = make([]WaterfallRule, 0)

	game.Started = false
}

func (game *WaterfallGame) AddPlayer(player player.WaterfallPlayer) bool {
	if game.HasPlayer(player.Uuid) {
		return false
	}

	game.Players = append(game.Players, &player)

	if len(game.Players) == 1 {
		game.CurrentPlayer = game.Players[0].Uuid
	} else if len(game.Players) == 2 && game.Started {
		game.IncrementNextPlayer(false)
	}

	response, _ := json.Marshal(websockets.JoinResponse{
		Response: websockets.Response{
			Action: 0,
			Sent:   time.Now(),
		}, Player: player, PlayerInformation: websockets.NextPlayerResponse{
			Current:    game.CurrentPlayer,
			NextPlayer: game.Players[game.NextPlayer].Uuid,
		},
	})

	if len(game.Players) > 0 {
		game.SocketHub.BroadcastMessage("", response)
	}

	return true
}

func (game *WaterfallGame) addOfflinePlayer(uuid, username, avatar string) {
	if game.HasPlayer(uuid) {
		return
	}

	player := player.WaterfallPlayer{
		Uuid:     uuid,
		Username: username,
		Avatar:   avatar,
		Offline:  true,
	}

	game.Players = append(game.Players, &player)

	response, _ := json.Marshal(websockets.JoinResponse{
		Response: websockets.Response{
			Action: 0,
			Sent:   time.Now(),
		}, Player: player, PlayerInformation: websockets.NextPlayerResponse{
			Current:    game.CurrentPlayer,
			NextPlayer: game.Players[game.NextPlayer].Uuid,
		},
	})

	if len(game.Players) > 0 {
		game.SocketHub.BroadcastMessage("", response)
	}
}

func (game *WaterfallGame) RemovePlayer(uuid string) bool {

	if !game.HasPlayer(uuid) {
		return false
	}

	players := make([]*player.WaterfallPlayer, 0)

	for i := 0; i < len(game.Players); i++ {
		if game.Players[i].Uuid == uuid {
			continue
		}
		players = append(players, game.Players[i])
	}

	dates := make([]WaterfallDate, 0)
	for i := 0; i < len(game.Dates); i++ {
		if game.Dates[i].Date == uuid || game.Dates[i].Owner == uuid {
			continue
		}
		dates = append(dates, game.Dates[i])
	}

	game.Players = players
	game.Dates = dates

	if len(game.Players) == 1 {
		game.CurrentPlayer = game.Players[0].Uuid
		game.NextPlayer = 0
	}

	if len(game.Players) >= 1 {

		response, _ := json.Marshal(websockets.RemovalResponse{
			Response: websockets.Response{
				Action: 1,
				Sent:   time.Now(),
			}, UUID: uuid, Players: websockets.NextPlayerResponse{
				Current:    game.CurrentPlayer,
				NextPlayer: game.Players[game.NextPlayer].Uuid,
			},
		})

		game.SocketHub.BroadcastMessage("", response)
	}

	return true
}

func (game *WaterfallGame) GetPlayer(uuid string) (player *player.WaterfallPlayer, err bool) {
	for _, v := range game.Players {
		if v.Uuid == uuid {

			player = v
			return
		}
	}

	err = true
	return
}

func (game *WaterfallGame) HasPlayer(uuid string) bool {
	for _, v := range game.Players {
		if v.Uuid == uuid {

			return true
		}
	}

	return false
}

func (game *WaterfallGame) NextTurn() {

	if len(game.Deck.Cards) == 0 {

		response, _ := json.Marshal(websockets.Response{
			Action: 22,
			Sent:   time.Now(),
		})

		game.Init()
		game.SocketHub.BroadcastMessage("", response)
		return
	}

	game.Card = *game.Deck.Pop(game.Players[game.NextPlayer].Uuid, game.Settings.Actions)

	game.IncrementNextPlayer(true)
	nextUser := game.Players[game.NextPlayer].Uuid

	response, _ := json.Marshal(websockets.NextCardResponse{
		Response: websockets.Response{
			Action: 2,
			Sent:   time.Now(),
		},
		Card: websockets.CardResponse{
			Card:      game.Card,
			CardsLeft: len(game.Deck.Cards),
		}, PlayerResponse: websockets.NextPlayerResponse{
			Current:    game.Card.CreatorUUID,
			NextPlayer: nextUser,
		},
	})

	game.SocketHub.BroadcastMessage("", response)
}

func (game *WaterfallGame) SkipTurn(player string) {

	if game.SkipPlayers == nil {
		game.SkipPlayers = make([]string, 0)
	}

	if len(game.SkipPlayers)+1 >= (len(game.Players) / 2) {
		game.IncrementNextPlayer(false)
		currentUser := game.CurrentPlayer
		nextUser := game.Players[game.NextPlayer].Uuid

		response, _ := json.Marshal(websockets.SkipPlayerResponse{
			Response: websockets.Response{
				Action: 3,
				Sent:   time.Now(),
			}, NextPlayerInformation: websockets.NextPlayerResponse{
				Current:    currentUser,
				NextPlayer: nextUser,
			}, Skips: 0,
		})

		game.SkipPlayers = make([]string, 0)

		game.SocketHub.BroadcastMessage("", response)
		return
	}

	if game.ContainsSkippedPlayer(player) {
		return
	}
	game.SkipPlayers = append(game.SkipPlayers, player)
}

func (game *WaterfallGame) IncrementNextPlayer(update bool) {
	if game.NextPlayer+1 > len(game.Players)-1 {
		game.NextPlayer = 0
	} else {
		game.NextPlayer++
	}
	if update {
		game.CurrentPlayer = game.Players[game.NextPlayer].Uuid
	}
}

func (game *WaterfallGame) ContainsSkippedPlayer(uuid string) bool {
	for _, skipped := range game.SkipPlayers {
		if skipped == uuid {
			return true
		}
	}
	return false
}

func (game *WaterfallGame) AddDate(date WaterfallDate) {
	game.Dates = append(game.Dates, date)

	response, _ := json.Marshal(
		websockets.DateResponse{
			Response: websockets.Response{
				Action: 4,
				Sent:   time.Now(),
			}, Date: websockets.Date{
				Owner: date.Owner,
				Date:  date.Date,
			},
		},
	)

	game.SocketHub.BroadcastMessage("", response)

}

func (game *WaterfallGame) AddRule(rule WaterfallRule) {

	game.Rules = append(game.Rules, rule)

	response, _ := json.Marshal(
		websockets.RuleResponse{
			Response: websockets.Response{
				Action: 5,
				Sent:   time.Now(),
			}, Rule: websockets.Rule{
				UUID:    rule.UUID,
				Creator: rule.Owner,
				Rule:    rule.Description,
			},
		},
	)

	game.SocketHub.BroadcastMessage("", response)

}

func (game *WaterfallGame) AddReady(uuid string) {

	readyResponse := websockets.ReadyPlayerResponse{
		Response: websockets.Response{
			Action: 20,
			Sent:   time.Now(),
		},
		UUID: uuid,
	}

	if game.containsReady(uuid) {

		readyPlayers := []string{}

		for _, v := range game.ReadyPlayers {
			if v == uuid {
				continue
			}
			readyPlayers = append(readyPlayers, v)
		}

		game.ReadyPlayers = readyPlayers
		readyResponse.Type = 0
	} else {
		game.ReadyPlayers = append(game.ReadyPlayers, uuid)
		readyResponse.Type = 1
	}

	response, _ := json.Marshal(
		readyResponse,
	)

	game.SocketHub.BroadcastMessage("", response)

}

func (game *WaterfallGame) containsReady(uuid string) bool {
	for v := range game.ReadyPlayers {
		player := game.ReadyPlayers[v]
		if player == uuid {
			return true
		}
	}
	return false
}

func (game *WaterfallGame) GetCardRule(face int, suite int, modifier bool) cards.CardRules {

	cardValue := cards.GetCardValue(cards.Card{
		Face:  face,
		Suite: suite,
	}, modifier)

	return cardValue
}

func (game *WaterfallGame) updateSetting(setting string, value any) {

	switch setting {
	case "maxPlayer":
		{
			game.Settings.MaxPlayers = int(value.(float64))
		}
	case "hiddenBack":
		{
			game.Settings.HiddenBack = value.(bool)
		}
	case "enableActions":
		{
			game.Settings.Actions = value.(bool)
		}
	}
	response, _ := json.Marshal(websockets.UpdateSettingResponse{
		Response: websockets.Response{Action: 23, Sent: time.Now()},
		Value:    value,
		Setting:  setting,
	})
	game.SocketHub.BroadcastMessage("", response)
}

func (g *WaterfallGame) RemoveInactivePlayers() {

	for {
		if len(g.Players) == 0 {
			break
		}
		for _, player := range g.Players {
			if player.Offline {
				continue
			}
			if !player.Disconnected {
				continue
			}
			if time.Now().UnixMilli()-player.DisconnectTime.UnixMilli() >= (90 * 1000) {
				client := g.SocketHub.GetClientByUUID(player.Uuid)
				if client == nil {
					g.mu.Lock()
					g.RemovePlayer(player.Uuid)
					g.mu.Unlock()
					continue
				} else {
					player.Disconnected = false
				}

			}
		}
	}

	g.Dispose()

	DeleteWaterfallGame(g.Uuid)
}

func (game *WaterfallGame) RunSocket() {

	h := game.SocketHub

	for {
		if game.ShouldDie {
			break
		}

		select {
		case client := <-h.Register:

			h.Clients[client] = true
			game.mu.Lock()

			player, err := game.GetPlayer(client.UUID)

			if !err {
				player.Disconnected = false
			}

			game.mu.Unlock()

		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
			}

			game.mu.Lock()
			player, err := game.GetPlayer(client.UUID)
			if !err {
				player.Disconnected = true
				player.DisconnectTime = time.Now()
			}
			game.mu.Unlock()

		case userMessage := <-h.Broadcast:
			var data map[string][]byte
			json.Unmarshal(userMessage, &data)

			game.mu.Lock()
			game.handleMessage(string(data["id"]), data["message"])
			game.mu.Unlock()

		}
	}
}

func (game *WaterfallGame) HandleWildcard(card *cards.Card) {

	card.Details.Action = cards.GetCardAction(cards.GetDefaultCards(), *card, card.CreatorUUID)

	response, _ := json.Marshal(
		websockets.WildcardResponse{
			Response: websockets.Response{
				Action: 6,
				Sent:   time.Now(),
			},
			Card: websockets.CardResponse{
				Card: *card,
			},
		},
	)

	game.SocketHub.BroadcastMessage("", response)
}

func (game *WaterfallGame) handleMessage(senderID string, message []byte) {
	var request websockets.SocketRequest
	err := json.Unmarshal(message, &request)

	client := game.SocketHub.GetClient(senderID)

	if err != nil {
		client.Send <- []byte("Error Found at inception")
		return
	}

	if client.UUID == "" {
		client.UUID = request.SenderUUID
	}

	switch request.Action {

	case 1: // User Removed
		{
			var reqRemove websockets.RemovePlayerRequest
			err := json.Unmarshal(message, &reqRemove)

			if err != nil {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
				return
			}
			successful := game.RemovePlayer(reqRemove.PlayerUUID)

			if !successful {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
			}
		}
	case 2:
		{
			game.NextTurn()
		}
	case 3:
		{
			game.SkipTurn(request.SenderUUID)
		}
	case 4:
		{

			var reqDate websockets.DateRequest
			err := json.Unmarshal(message, &reqDate)

			if err != nil {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
				return
			}
			game.AddDate(WaterfallDate{
				Owner: reqDate.Date.Owner,
				Date:  reqDate.Date.Date,
			})
		}
	case 5:
		{
			var reqRule websockets.RuleRequest
			err := json.Unmarshal(message, &reqRule)

			if err != nil {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
				return
			}
			game.AddRule(WaterfallRule{
				UUID:        reqRule.Rule.UUID,
				Owner:       reqRule.Rule.Creator,
				Description: reqRule.Rule.Rule,
			})
		}
	case 6:
		{
			var reqWildcard websockets.WildcardRequest
			err := json.Unmarshal(message, &reqWildcard)
			if err != nil {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
				return
			}

			game.HandleWildcard(&reqWildcard.Card)
		}
	case 20:
		{
			var reqReady websockets.ReadyRequest
			err := json.Unmarshal(message, &reqReady)
			if err != nil {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
				return
			}
			game.AddReady(reqReady.UUID)
		}
	case 21:
		{
			if request.SenderUUID != game.Owner {
				return
			}

			game.Start()
		}

	case 23:
		{
			if request.SenderUUID != game.Owner {
				return
			}

			var reqSetting websockets.UpdateSettingRequest
			err := json.Unmarshal(message, &reqSetting)
			if err != nil {
				game.SocketHub.GetClient(senderID).Send <- []byte("Error Found")
				return
			}

			game.updateSetting(reqSetting.Setting, reqSetting.Value)
		}
	case 24:
		{
			if request.SenderUUID != game.Owner {
				return
			}

			var reqOffline websockets.OfflinePlayerRequest
			err := json.Unmarshal(message, &reqOffline)

			if err != nil {
				return
			}

			game.addOfflinePlayer(reqOffline.UUID, reqOffline.Username, reqOffline.Avatar)
		}
	}

}

func (game *WaterfallGame) Dispose() {
	game.ShouldDie = true
	game.ReadyPlayers = nil
	game.SkipPlayers = nil
	game.Players = nil

	game.Dates = nil
	game.Rules = nil

	game.CardRules = nil

	game.SocketHub.Close()
}
