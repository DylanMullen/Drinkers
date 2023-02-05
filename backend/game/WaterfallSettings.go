package game

type WaterfallSettings struct {
	GameName   string `json:"gameName"`
	GameCode   string `json:"joinCode"`
	Actions    bool   `json:"actionsEnabled"`
	HiddenBack bool   `json:"hiddenBack"`
	MaxPlayers int    `json:"maxPlayers"`
}
