package models

type Response struct {
	ID      RequestID `json:"id"`
	Content any       `json:"body"`
}

type CreateResponse struct {
	Settings PirateSettings `json:"settings"`
	Game     GameJSON       `json:"game"`
}

type JoinResponse struct {
	Current    string       `json:"current"`
	NextPlayer string       `json:"next"`
	Player     PiratePlayer `json:"player"`
}

type RemovePlayerResponse struct {
	UUID string `json:"uuid"`
}

type NextTurnResponse struct {
	Current    string       `json:"current"`
	NextPlayer string       `json:"next"`
	Turns      int          `json:"turns"`
	Prompt     PiratePrompt `json:"prompt"`
}

/* Additional Stuff*/

type GameJSON struct {
	Prompts   map[int]PiratePrompt `json:"prompts"`
	Turns     int                  `json:"turns"`
	Players   PlayersJSON          `json:"players"`
	Mechanics any                  `json:"mechanics"`
}

type PlayersJSON struct {
	Current string               `json:"current"`
	Next    string               `json:"next"`
	Users   map[int]PiratePlayer `json:"users"`
}
