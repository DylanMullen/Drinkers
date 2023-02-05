package rest

import (
	"drinkers.beer/waterfall/game"
	"drinkers.beer/waterfall/player"
)

type CreateRequest struct {
	Owner    player.WaterfallPlayer `json:"owner"`
	Settings game.WaterfallSettings `json:"settings"`
}

type JoinRequest struct {
	GameCode string                 `json:"joinCode"`
	Player   player.WaterfallPlayer `json:"player"`
}

type CardRuleRequest struct {
	Face     int  `json:"face"`
	Modifier bool `json:"modifier"`
	Suite    int  `json:"suite"`
}
