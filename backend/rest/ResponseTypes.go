package rest

import (
	"drinkers.beer/waterfall/cards"
	"drinkers.beer/waterfall/player"
)

type WaterfallState struct {
	Lobby WaterfallLobby    `json:"lobby"`
	Game  WaterfallGameJSON `json:"game"`
	Card  WaterfallCardJSON `json:"card"`
}

// "s": {
// 	"gameId":   g.Uuid,
// 	"ownerId":  g.Owner,
// 	"gameName": g.Settings.GameName,
// 	"joinCode": g.Uuid,
// 	"players": {
// 		"current": g.CurrentPlayer,
// 		"next":    g.Players[g.NextPlayer].UUID,
// 	},
// }

type WaterfallLobby struct {
	ReadyPlayers []string `json:"readyPlayers"`
}

type WaterfallGameJSON struct {
	GameId    string               `json:"gameId"`
	OwnerId   string               `json:"ownerId"`
	GameName  string               `json:"gameName"`
	JoinCode  string               `json:"joinCode"`
	Started   bool                 `json:"started"`
	Players   WaterfallPlayersJSON `json:"players"`
	Mechanics WaterfallMechanics   `json:"mechanics"`
}

type WaterfallPlayersJSON struct {
	CurrentPlayer string                    `json:"current"`
	NextPlayer    string                    `json:"next"`
	Max           int                       `json:"max"`
	Users         []*player.WaterfallPlayer `json:"users"`
}

type WaterfallCardJSON struct {
	cards.Card
	CreatorUUID     string `json:"creatorUUID"`
	CardsLeft       int    `json:"cardsLeft"`
	cards.CardRules `json:"details"`
}

type WaterfallNextPlayerResponse struct {
	NextPlayer string `json:"next"`
}

type WaterfallMechanics struct {
	Thumbmaster string                `json:"thumbmaster"`
	HiddenBack  bool                  `json:"hiddenBack"`
	Actions     bool                  `json:"actions"`
	Rules       map[int]WaterfallRule `json:"rules"`
	Dates       map[int]WaterfallDate `json:"dates"`
}

type WaterfallRule struct {
	UUID        string `json:"uuid"`
	Owner       string `json:"creator"`
	Description string `json:"rule"`
}

type WaterfallDate struct {
	Owner string `json:"owner"`
	Date  string `json:"date"`
}

type CardRuleResponse struct {
	Details cards.CardRules `json:"details"`
}
