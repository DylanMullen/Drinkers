package models

import "time"

type PiratePlayer struct {
	UUID     string `json:"uuid"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
	Bot      bool   `json:"bot"`

	Disconnected     bool      `json:"-"`
	DisconnectTime   time.Time `json:"-"`
	DisconnectSender time.Time `json:"-"`
}
