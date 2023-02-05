package models

type PirateSettings struct {
	UUID       string `json:"uuid"`
	OwnerID    string `json:"owner"`
	MaxPlayers int8   `json:"maxPlayers"`
	JoinCode   string `json:"joinCode"`
	Started    bool   `json:"hasStarted"`

	ShouldDie bool     `json:"-"`
	Packs     []string `json:"-"`
}

type PirateCreatorSettings struct {
	OwnerID    string   `json:"ownerID"`
	Packs      []string `json:"packs"`
	MaxPlayers int8     `json:"maxPlayers"`
}
