package pirate

import (
	"net/http"
	"strconv"

	"drinkers.beer/waterfall/gamemodes/pirate/errors"
	"drinkers.beer/waterfall/gamemodes/pirate/models"
	"drinkers.beer/waterfall/websockets"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var (
	games map[string]*PirateGame = make(map[string]*PirateGame, 0)
)

func HandleRequests(router *gin.RouterGroup) {
	router.GET("/", handleIndexRequest)
	router.GET("/packs", handlePacksRequest)
	router.POST("/create", handleCreateRequest)
	router.POST("/join", handleJoinRequest)
	router.GET("/game/:gameID", handleFindRequest)
	router.GET("/ws/:gameID", handleWebsocketRequest)
}

func handleIndexRequest(c *gin.Context) {

	message := strconv.Itoa(len(games)) + " Games of Pirate"

	c.JSON(http.StatusOK, models.Response{
		ID:      0,
		Content: message,
	})
}

func handlePacksRequest(c *gin.Context) {

	c.JSON(http.StatusOK, models.Response{
		ID: 0,
		Content: gin.H{
			"packs": LoadedPacksJSON(),
		},
	})

}

func handleCreateRequest(c *gin.Context) {
	var req models.CreateRequest
	err := c.BindJSON(&req)

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			ID:      0,
			Content: gin.H{"error": errors.CouldNotBind{Message: err.Error()}},
		})
		return
	}

	game := CreatePirateGame(req.Settings, req.Player)

	c.JSON(http.StatusOK, models.CreateResponse{
		Settings: game.settings,
		Game:     game.ToGameJSON(),
	})
}

func handleJoinRequest(c *gin.Context) {
	var joinReq models.JoinRequest
	err := c.BindJSON(&joinReq)

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			ID:      1,
			Content: gin.H{"error": "Failed to join Game. Could not bind JSON."},
		})
		return
	}

	game, err := getPirateGameByCode(joinReq.JoinCode)

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			ID:      1,
			Content: gin.H{"error": err.Error()},
		})
		return
	}

	game.addPlayer(joinReq.Player)

	c.JSON(http.StatusOK, models.CreateResponse{
		Settings: game.settings,
		Game:     game.ToGameJSON(),
	})
}

func handleFindRequest(c *gin.Context) {
	gameID := c.Param("gameID")
	uuid := c.Query("uuid")
	game, err := getPirateGameByCode(gameID)

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			ID:      2,
			Content: gin.H{"error": errors.GameNotFound{Message: gameID}},
		})
		return
	}

	contains := game.hasPlayer(uuid)

	c.JSON(http.StatusOK, models.Response{
		ID: 2,
		Content: gin.H{
			"playerFound": contains,
			"game": models.CreateResponse{
				Settings: game.settings,
				Game:     game.ToGameJSON(),
			},
		},
	})

}

func handleWebsocketRequest(c *gin.Context) {
	gameId := c.Param("gameID")

	game, err := getPirateGame(gameId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": errors.GameNotFound{Message: "UUID: " + gameId}})
		return
	}
	websockets.HandleWs(game.socket, c)
}

func CreatePirateGame(settings models.PirateCreatorSettings, player models.PiratePlayer) PirateGame {
	uuid := uuid.NewString()
	prompts := GetPiratePrompts(settings.Packs)
	socket := websockets.GetNewHub()

	game := PirateGame{
		settings: models.PirateSettings{
			UUID:       uuid,
			OwnerID:    settings.OwnerID,
			MaxPlayers: settings.MaxPlayers,
			JoinCode:   uuid[:6],
			Packs:      settings.Packs,
		},
		socket:  socket,
		prompts: prompts,
	}

	game.Init(player)

	go game.Run()

	games[uuid] = &game

	return game
}

func GetPiratePrompts(packs []string) []models.PiratePrompt {

	prompts := make([]models.PiratePrompt, 0)

	for _, v := range packs {
		pack, err := GetPack(v)
		if err != nil {
			continue
		}
		prompts = append(prompts, pack.Prompts...)
	}

	return prompts
}

func ContainsGame(uuid string) bool {
	for _, v := range games {
		if v.settings.UUID == uuid {
			return true
		}
	}
	return false
}

func getPirateGame(uuid string) (game *PirateGame, err error) {
	for _, v := range games {
		if v.settings.UUID == uuid {
			game = v
			return
		}
	}
	err = errors.GameNotFound{
		Message: "UUID: " + uuid,
	}
	return
}

func getPirateGameByCode(code string) (game *PirateGame, err error) {
	for _, v := range games {
		if v.settings.JoinCode == code {
			game = v
			return
		}
	}
	err = errors.GameNotFound{
		Message: "Join Code: " + code,
	}
	return
}
