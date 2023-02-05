package models

import "drinkers.beer/waterfall/models"

type GameType string

const (
	CARD GameType = "CARD"
	DICE GameType = "DICE"
)

type GameSettings struct {
	UUID     string   `json:"gameID"`
	OwnerID  string   `json:"ownerID"`
	GameType GameType `json:"type"`
}

type Gameplay struct {
	HasStarted    bool    `json:"started"`
	CurrentNumber int     `json:"currentNumber"`
	CurrentStreak int     `json:"streak"`
	Players       Players `json:"players"`
}

type Players struct {
	CurrentPlayer HigherLowerPlayer   `json:"current"`
	Players       []HigherLowerPlayer `json:"players"`
}

type HigherLowerPlayer struct {
	models.User
}
