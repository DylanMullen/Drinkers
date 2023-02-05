package models

type PiratePack struct {
	Settings PiratePackSettings `json:"settings"`

	Prompts []PiratePrompt `json:"prompts"`
}

type PiratePackSettings struct {
	UUID        string `json:"uuid"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Disabled    bool   `json:"disabled"`
}

type PiratePrompt struct {
	UUID        string      `json:"uuid"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Cooldown    int8        `json:"cooldown"`
	Scheme      interface{} `json:"scheme"`
}
