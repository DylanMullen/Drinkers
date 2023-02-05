package models

type CreateReq struct {
	OwnerID  string   `json:"ownerID"`
	GameType GameType `json:"type"`
}

type JoinReq struct {
	GameID string            `json:"gameID"`
	Player HigherLowerPlayer `json:"player"`
}

type NextTurnReq struct {
	Action string `json:"action"`
}
