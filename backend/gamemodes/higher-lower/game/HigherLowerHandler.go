package game

import (
	"encoding/json"

	"drinkers.beer/waterfall/gamemodes/higher-lower/models"
	pirate "drinkers.beer/waterfall/gamemodes/pirate/models"
)

const (
	JOIN_REQUEST  pirate.RequestID = 1
	LEAVE_REQUEST pirate.RequestID = 2
	NEXT_TURN     pirate.RequestID = 3
)

func (game *HigherLower) handleMessage(senderID string, message []byte) {
	var request pirate.Request
	err := json.Unmarshal(message, &request)

	if err != nil {
		return
	}

	switch request.ID {
	case NEXT_TURN:
		handleNextTurn(game, request.Content)
	default:
		break
	}
}

func handleNextTurn(game *HigherLower, action any) {
	req := action.(models.NextTurnReq)
	game.nextTurn(req.Action)
}
