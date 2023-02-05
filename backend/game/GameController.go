package game

import (
	"drinkers.beer/waterfall/cards"
	"drinkers.beer/waterfall/player"
	"drinkers.beer/waterfall/websockets"
	"github.com/google/uuid"
)

var (
	games map[string]*WaterfallGame = make(map[string]*WaterfallGame, 0)
)

func CreateWaterfallGame(owner player.WaterfallPlayer, settings *WaterfallSettings) *WaterfallGame {

	uuid := uuid.NewString()
	settings.GameCode = uuid[:6]

	game := WaterfallGame{
		Uuid:         uuid,
		Owner:        owner.Uuid,
		Players:      make([]*player.WaterfallPlayer, 0),
		NextPlayer:   0,
		Settings:     *settings,
		ReadyPlayers: make([]string, 0),
		ShouldDie:    false,
		Deck:         cards.CreateDeck(true),
		CardRules:    cards.GetDefaultCards(),
	}

	game.SocketHub = websockets.GetNewHub()

	game.AddPlayer(owner)
	games[game.Uuid] = &game

	go game.RunSocket()
	go game.RemoveInactivePlayers()

	return games[game.Uuid]
}

func DeleteWaterfallGame(uuid string) bool {
	if !ContainsGame(uuid) {
		return false
	}

	delete(games, uuid)

	return !ContainsGame(uuid)
}

func GetWaterfallGame(uuid string) (g *WaterfallGame, err bool) {
	if !ContainsGame(uuid) {
		err = true
		return
	}
	return games[uuid], false
}

func GetWaterfallGameByCode(gameCode string) (g *WaterfallGame, err bool) {
	for _, v := range games {
		if v.Settings.GameCode == gameCode {
			g = v
			err = false
			return
		}
	}
	err = true
	return
}

func ContainsGame(uuid string) bool {
	_, found := games[uuid]

	return found
}

func ContainsGameByCode(gameCode string) bool {
	for _, v := range games {
		if v.Settings.GameCode == gameCode {
			return true
		}
	}
	return false
}

func Size() int {
	return len(games)
}

func GetGames() map[string]*WaterfallGame {
	return games
}
