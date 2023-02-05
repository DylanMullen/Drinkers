package models

type RequestID int8
type Content interface{}

type Request struct {
	ID      RequestID              `json:"id"`
	Sender  string                 `json:"sender"`
	Content map[string]interface{} `json:"content"`
}

type CreateRequest struct {
	Player   PiratePlayer          `json:"player"`
	Settings PirateCreatorSettings `json:"settings"`
}

type JoinRequest struct {
	JoinCode string       `json:"joinCode"`
	Player   PiratePlayer `json:"player"`
}

type LeaveRequest struct {
	UUID string `json:"uuid"`
}
