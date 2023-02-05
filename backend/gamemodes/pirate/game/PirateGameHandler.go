package pirate

import (
	"encoding/json"
	"fmt"

	"drinkers.beer/waterfall/gamemodes/pirate/models"
)

const (
	JOIN_REQUEST  models.RequestID = 1
	LEAVE_REQUEST models.RequestID = 2
	NEXT_TURN     models.RequestID = 3
)

func (game *PirateGame) handleMessage(senderID string, message []byte) {
	var request models.Request
	err := json.Unmarshal(message, &request)

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	switch request.ID {
	case JOIN_REQUEST:
		handleJoin(game, request.Content)
	case LEAVE_REQUEST:
		handleLeave(game, request.Content)
	case NEXT_TURN:
		handleNextTurn(game)
	default:
		break
	}
}

func handleJoin(game *PirateGame, content any) {
	req := content.(models.JoinRequest)
	game.addPlayer(req.Player)
}

func handleLeave(game *PirateGame, content any) {
	req := content.(models.LeaveRequest)
	game.removePlayer(req.UUID)
}

func handleNextTurn(game *PirateGame) {
	game.nextTurn()
}
