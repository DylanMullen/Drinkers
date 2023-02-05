package websockets

import (
	"time"

	"drinkers.beer/waterfall/cards"
	"drinkers.beer/waterfall/player"
)

type Response struct {
	Action int       `json:"action"`
	Sent   time.Time `json:"sentAt"`
}

type JoinResponse struct {
	Response
	Player            player.WaterfallPlayer `json:"player"`
	PlayerInformation NextPlayerResponse     `json:"playerInfo"`
}

type RemovalResponse struct {
	Response
	UUID    string             `json:"uuid"`
	Players NextPlayerResponse `json:"players"`
}

type NextCardResponse struct {
	Response
	Card           CardResponse       `json:"card"`
	PlayerResponse NextPlayerResponse `json:"player"`
}

type NextPlayerResponse struct {
	Current    string `json:"current"`
	NextPlayer string `json:"next"`
}

type CardResponse struct {
	cards.Card
	CardsLeft int `json:"cardsLeft"`
}

type SkipPlayerResponse struct {
	Response
	NextPlayerInformation NextPlayerResponse `json:"players"`
	Skips                 int                `json:"skips"`
}

type DateResponse struct {
	Response
	Date Date `json:"date"`
}

type RuleResponse struct {
	Response
	Rule Rule `json:"rule"`
}

type UpdateNextPlayer struct {
	Response
	Players NextPlayerResponse `json:"players"`
}

type CardRuleResponse struct {
	Response
	Details cards.CardRules `json:"details"`
}

type ReadyPlayerResponse struct {
	Response
	UUID string `json:"uuid"`
	Type int    `json:"type"`
}

type UpdateSettingResponse struct {
	Response
	Setting string `json:"setting"`
	Value   any    `json:"value"`
}

type WildcardResponse struct {
	Response
	Card CardResponse `json:"card"`
}
