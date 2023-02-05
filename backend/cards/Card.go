package cards

type Card struct {
	Suite       int       `json:"suite"`
	Face        int       `json:"face"`
	CreatorUUID string    `json:"creatorUUID,omitempty"`
	Details     CardRules `json:"details,omitempty"`
}
