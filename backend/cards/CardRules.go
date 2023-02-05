package cards

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"strconv"
	"time"

	"github.com/buger/jsonparser"
)

var cardRules []byte

func GetDefaultCards() []byte {
	if cardRules != nil {
		return cardRules
	}

	jsonFile, err := os.Open("./data/cards-default.json")

	if err != nil {
		fmt.Println("Error")
	}

	defer jsonFile.Close()

	value, _ := ioutil.ReadAll(jsonFile)
	cardRules = value
	return cardRules
}

func GetCardValue(card Card, modifer bool) CardRules {
	cardRules := GetDefaultCards()

	if HasModifiers(cardRules, card.Face) && modifer {
		return GetCardModiferRule(cardRules, card)
	}

	ruleKey := []string{"cards", strconv.Itoa(card.Face), "rule"}

	value, _, _, _ := jsonparser.Get(cardRules, ruleKey...)

	var rule CardRules
	json.Unmarshal(value, &rule)
	return rule
}

func GetCardAction(c []byte, card Card, current string) CardAction {
	valid, action := HasAction(c, card, HasModifiers(c, card.Face))

	if !valid {
		return nil
	}

	return getActions(c, action, current)

}

func HasModifiers(cardRules []byte, index int) bool {
	modifierKey := []string{"cards", strconv.Itoa(index), "modifiers", "enabled"}
	value, err := jsonparser.GetBoolean(cardRules, modifierKey...)

	if err != nil {
		return false
	}

	return value
}

func HasAction(cardRules []byte, card Card, modifier bool) (valid bool, action int) {
	if modifier {
		isRed := card.Suite == 0 || card.Suite == 1
		color := "red"
		if !isRed {
			color = "black"
		}

		modifierKey := []string{"cards", strconv.Itoa(card.Face), "modifiers", color, "action"}
		value, _, _, err := jsonparser.Get(cardRules, modifierKey...)

		if err != nil {
			valid = false
			return
		}

		var object map[string]interface{}
		err = json.Unmarshal(value, &object)

		valid = err != nil
		if valid {
			action = int(object["id"].(float64))
		}

		return
	}

	key := []string{"cards", strconv.Itoa(card.Face), "rule", "action"}

	value, _, _, err := jsonparser.Get(cardRules, key...)

	if err != nil {
		valid = false
		return
	}

	var object map[string]interface{}
	err = json.Unmarshal(value, &object)

	valid = err == nil

	if valid {
		action = int(object["id"].(float64))
	}
	return
}

func GetCardModiferRule(cardRules []byte, card Card) CardRules {
	modifierKey := []string{"cards", strconv.Itoa(card.Face), "modifiers"}

	if card.Suite == 0 || card.Suite == 1 {
		modifierKey = append(modifierKey, "red")
	} else {
		modifierKey = append(modifierKey, "black")
	}

	value, _, _, _ := jsonparser.Get(cardRules, modifierKey...)

	var rule CardRules
	json.Unmarshal(value, &rule)
	return rule
}

//Actions
/*
	0:Thumbmaster
	1:Date
	2:Rule
	3:Wildcard
*/

func getActions(c []byte, action int, current string) CardAction {

	response := GenericAction{
		Id: action,
	}

	content := make(map[string]any)

	switch action {
	case 6:
		{
			content["suggestions"] = GetSuggestedRules(c)
		}
	case 7:
		{

			content["cards"] = GetWilcardCards(c, current)
		}
	default:
		{
			break
		}
	}

	response.Content = content

	return response

}

func GetSuggestedRules(c []byte) map[int]Rule {
	ruleJson := getRulesJSON(c)

	indexes := getRandomIndexs(len(ruleJson), 3)

	response := make(map[int]Rule, 0)

	for i := 0; i < len(indexes); i++ {

		r := ruleJson[indexes[i]].(map[string]interface{})

		response[i] = Rule{
			Title:       r["title"].(string),
			Description: r["description"].(string),
		}
	}

	return response
}

func GetWilcardCards(c []byte, uuid string) map[int]Card {
	cards := getCardsJSON(c)
	indexes := getRandomIndexs(len(cards), 3)

	response := make(map[int]Card, 0)
	for i := 0; i < len(indexes); i++ {

		index, err := strconv.Atoi(indexes[i])

		if err != nil {
			continue
		}

		card := getRandomCard(index, uuid)
		response[i] = card
	}

	return response
}

func getRandomCard(face int, uuid string) Card {
	rand.Seed(time.Now().UnixNano())
	suite := rand.Intn(4)

	card := Card{
		Face:        face,
		Suite:       suite,
		CreatorUUID: uuid,
	}

	card.Details = GetCardValue(card, true)

	return card

}

func getRandomIndexs(length, amount int) []string {
	response := make([]string, 0)

	selected := make(map[int]bool, 0)

	rand.Seed(time.Now().UnixNano())

	for i := 0; i < amount; i++ {
		index := rand.Intn(length)

		if selected[index] {
		inner:
			for i := 0; i < length; i++ {
				index = rand.Intn(length)
				if selected[index] {
					continue inner
				}
			}
		}
		selected[index] = true
	}

	for k := range selected {
		response = append(response, strconv.Itoa(k))
	}

	return response

}

func getRulesJSON(c []byte) map[string]interface{} {
	value, _, _, _ := jsonparser.Get(c, "rules")

	var object map[string]interface{}
	err := json.Unmarshal(value, &object)

	if err != nil {
		return nil
	}

	return object
}

func getCardsJSON(c []byte) map[string]interface{} {
	value, _, _, _ := jsonparser.Get(c, "cards")

	var object map[string]interface{}
	err := json.Unmarshal(value, &object)

	if err != nil {
		return nil
	}

	return object
}
