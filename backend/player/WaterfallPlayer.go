package player

import "time"

type WaterfallPlayer struct {
	Uuid     string `json:"uuid"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
	Offline  bool   `json:"offline"`

	Disconnected     bool      `json:"-"`
	DisconnectTime   time.Time `json:"-"`
	DisconnectSender time.Time `json:"-"`
}
