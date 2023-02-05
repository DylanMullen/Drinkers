package cards

import (
	"math/rand"
	"time"
)

type Deck struct {
	Cards []Card `json:"cards"`
}

func CreateDeck(shuffle bool) (x Deck) {
	deck := Deck{}
	deck.Populate(shuffle)
	return deck
}

func (deck *Deck) Populate(shuffle bool) {
	cards := make([]Card, 52)

	for i := 0; i < 52; i++ {
		cards[i] = Card{Suite: i % 4, Face: i % 13}
	}

	if shuffle {
		ShuffleCards(&cards)
	}

	deck.Cards = cards
}

func (deck *Deck) Pop(uuid string, actions bool) (card *Card) {
	index := len(deck.Cards) - 1
	card = &deck.Cards[index]
	card.CreatorUUID = uuid
	card.Details = GetCardValue(*card, true)
	if actions {
		card.Details.Action = GetCardAction(GetDefaultCards(), *card, uuid)
	}

	deck.Cards = deck.Cards[:index]
	return card
}

func ShuffleCards(cards *[]Card) {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(*cards), func(i, j int) {
		(*cards)[i], (*cards)[j] = (*cards)[j], (*cards)[i]
	})
}
