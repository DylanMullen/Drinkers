package models

type User struct {
	UUID     string `json:"uuid"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
	Bot      bool   `json:"bot"`
}
