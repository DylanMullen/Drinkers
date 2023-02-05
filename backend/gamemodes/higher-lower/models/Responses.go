package models

type Response struct {
	ID      int `json:"id"`
	Content any `json:"body"`
}

type NextTurnResponse struct {
	Player        HigherLowerPlayer `json:"player"`
	CurrentNumber int               `json:"number"`
	Streak        int               `json:"streak"`
}
type JoinResponse struct {
	Current    string            `json:"current"`
	NextPlayer string            `json:"next"`
	Player     HigherLowerPlayer `json:"player"`
}
