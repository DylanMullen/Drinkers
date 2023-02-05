package websockets

import "drinkers.beer/waterfall/cards"

type SocketRequest struct {
	Action     int    `json:"action"`
	SenderUUID string `json:"senderUUID"`
}

type RemovePlayerRequest struct {
	SocketRequest
	PlayerUUID string `json:"playerUUID"`
}

type SkipPlayerRequest struct {
	SocketRequest
}

type DateRequest struct {
	SocketRequest
	Date Date `json:"date"`
}

type RuleRequest struct {
	SocketRequest
	Rule Rule `json:"rule"`
}

type ReadyRequest struct {
	SocketRequest
	UUID string `json:"uuid"`
}
type UpdateSettingRequest struct {
	SocketRequest
	Setting string `json:"setting"`
	Value   any    `json:"value"`
}

type WildcardRequest struct {
	SocketRequest
	Card cards.Card `json:"card"`
}

type OfflinePlayerRequest struct {
	SocketRequest
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
	UUID     string `json:"uuid"`
}

//Construct
type Date struct {
	Owner string `json:"owner"`
	Date  string `json:"date"`
}

type Rule struct {
	UUID    string `json:"uuid"`
	Creator string `json:"creator"`
	Rule    string `json:"rule"`
}
