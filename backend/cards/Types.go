package cards

type CardRules struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Action      CardAction `json:"action,omitempty"`
}

type CardAction interface {
}

type GenericAction struct {
	CardAction `json:"-"`
	Id         int            `json:"id"`
	Content    map[string]any `json:"content"`
}

// type RuleAction struct {
// 	GenericAction
// 	Id          int          `json:"id"`
// 	Suggestions map[int]Rule `json:"suggestions"`
// }
// type WildcardAction struct {
// 	GenericAction
// 	Id    int          `json:"id"`
// 	Cards map[int]Card `json:"cards"`
// }

type Rule struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}
