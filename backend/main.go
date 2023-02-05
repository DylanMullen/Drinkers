package main

import (
	"net/http"

	"drinkers.beer/waterfall/cards"
	"drinkers.beer/waterfall/game"
	pirate "drinkers.beer/waterfall/gamemodes/pirate/game"
	"drinkers.beer/waterfall/rest"
	"drinkers.beer/waterfall/websockets"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {

	cards.GetDefaultCards()

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.Use(cors.Default())
	router.GET("/", handleIndex)

	pirate.LoadAllPacks()
	pirate.HandleRequests(router.Group("/pirate"))

	waterfallRoute := router.Group("/waterfall")
	{

		waterfallRoute.POST("/create", handleCreate)
		waterfallRoute.POST("/join", handleJoin)
		waterfallRoute.POST("/game/:gameID/card", handleCardValueRequest)

		waterfallRoute.GET("/ws/:gameID", handleWebsocket)
	}
	http.ListenAndServe(":5000", router)
	// http.ListenAndServe("192.168.0.16:5000", router)
	router.Run()

}

func handleIndex(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": "ok"})
}

func handleCreate(c *gin.Context) {
	var req rest.CreateRequest
	err := c.BindJSON(&req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failure creating game. Check JSON"})
		return
	}

	game := game.CreateWaterfallGame(req.Owner, &req.Settings)

	response := rest.WaterfallState{
		Lobby: rest.WaterfallLobby{
			ReadyPlayers: game.ReadyPlayers,
		},
		Game: rest.WaterfallGameJSON{
			GameId:   game.Uuid,
			OwnerId:  game.Owner,
			GameName: game.Settings.GameName,
			JoinCode: game.Settings.GameCode,
			Players: rest.WaterfallPlayersJSON{
				CurrentPlayer: game.CurrentPlayer,
				NextPlayer:    game.Players[game.NextPlayer].Uuid,
				Max:           game.Settings.MaxPlayers,
				Users:         game.Players,
			},
			Mechanics: rest.WaterfallMechanics{
				Thumbmaster: "",
				HiddenBack:  game.Settings.HiddenBack,
				Actions:     game.Settings.Actions,
				Rules:       make(map[int]rest.WaterfallRule),
				Dates:       make(map[int]rest.WaterfallDate),
			},
		}, Card: rest.WaterfallCardJSON{
			Card:      game.Card,
			CardRules: cards.GetCardValue(game.Card, true),
		},
	}

	c.JSON(http.StatusOK, response)
}

func handleJoin(c *gin.Context) {
	var req rest.JoinRequest
	err := c.BindJSON(&req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Internal Error. Try again soon!"})
		return
	}

	found := game.ContainsGameByCode(req.GameCode)

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game could not be found"})
		return
	}

	game, _ := game.GetWaterfallGameByCode(req.GameCode)

	if len(game.Players)+1 > game.Settings.MaxPlayers {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game is full"})
		return
	}

	game.AddPlayer(req.Player)

	response := rest.WaterfallState{
		Lobby: rest.WaterfallLobby{
			ReadyPlayers: game.ReadyPlayers,
		},
		Game: rest.WaterfallGameJSON{
			GameId:   game.Uuid,
			OwnerId:  game.Owner,
			GameName: game.Settings.GameName,
			JoinCode: game.Settings.GameCode,
			Started:  game.Started,
			Players: rest.WaterfallPlayersJSON{
				CurrentPlayer: game.CurrentPlayer,
				NextPlayer:    game.Players[game.NextPlayer].Uuid,
				Max:           game.Settings.MaxPlayers,
				Users:         game.Players,
			}, Mechanics: rest.WaterfallMechanics{
				Thumbmaster: "",
				HiddenBack:  game.Settings.HiddenBack,
				Actions:     game.Settings.Actions,
				Rules:       toRuleMap(&game.Rules),
				Dates:       toDateMap(&game.Dates),
			},
		}, Card: rest.WaterfallCardJSON{
			Card:        game.Card,
			CreatorUUID: game.Card.CreatorUUID,
			CardsLeft:   len(game.Deck.Cards),
			CardRules:   cards.GetCardValue(game.Card, true),
		},
	}

	c.JSON(http.StatusOK, response)
}

func toRuleMap(rules *[]game.WaterfallRule) map[int]rest.WaterfallRule {
	response := make(map[int]rest.WaterfallRule, 0)
	for index, rule := range *rules {
		response[index] = rest.WaterfallRule{
			UUID:        rule.UUID,
			Owner:       rule.Owner,
			Description: rule.Description,
		}
	}
	return response
}

func toDateMap(dates *[]game.WaterfallDate) map[int]rest.WaterfallDate {
	response := make(map[int]rest.WaterfallDate, 0)
	for index, date := range *dates {
		response[index] = rest.WaterfallDate{
			Owner: date.Owner,
			Date:  date.Date,
		}
	}
	return response
}

func handleWebsocket(c *gin.Context) {
	gameId := c.Param("gameID")
	if !game.ContainsGame(gameId) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game could not be found."})
		return
	}

	waterfallGame, _ := game.GetWaterfallGame(gameId)
	websockets.HandleWs(waterfallGame.SocketHub, c)
}

func handleCardValueRequest(c *gin.Context) {
	gameId := c.Param("gameID")

	var req rest.CardRuleRequest
	err := c.BindJSON(&req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failure to find card. Check JSON"})
		return
	}

	if !game.ContainsGame(gameId) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game could not be found."})
		return
	}
	waterfallGame, _ := game.GetWaterfallGame(gameId)

	cardValue := waterfallGame.GetCardRule(req.Face, req.Suite, req.Modifier)

	response := rest.CardRuleResponse{
		Details: cards.CardRules{
			Title:       cardValue.Title,
			Description: cardValue.Description,
		},
	}

	c.JSON(http.StatusOK, response)
}
