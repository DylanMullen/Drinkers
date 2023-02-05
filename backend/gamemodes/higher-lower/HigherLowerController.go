package higherlower

import (
	"net/http"

	"drinkers.beer/waterfall/gamemodes/higher-lower/game"
	"drinkers.beer/waterfall/gamemodes/higher-lower/models"
	"drinkers.beer/waterfall/gamemodes/pirate/errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var (
	games map[string]*game.HigherLower = make(map[string]*game.HigherLower, 0)
)

func HandleRequests(router *gin.RouterGroup) {

	router.POST("/create", handleCreate)
	router.POST("/join", handleJoin)
}

func handleCreate(c *gin.Context) {

	var req models.CreateReq
	err := c.BindJSON(&req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			ID:      0,
			Content: "Could not create game",
		})
		return
	}

	game := createGame(req.OwnerID, req.GameType)

	c.JSON(http.StatusOK, models.Response{
		ID:      0,
		Content: game,
	})
}

func handleJoin(c *gin.Context) {
	var req models.JoinReq
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			ID:      1,
			Content: "Could not join game",
		})
		return
	}

	game, err := getHigherLowerGame(req.GameID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			ID:      1,
			Content: "Could not join game",
		})
		return
	}

	game.AddPlayer(req.Player)

	c.JSON(http.StatusOK, models.Response{
		ID:      1,
		Content: game,
	})
}

func createGame(ownerID string, gameType models.GameType) game.HigherLower {
	game := game.HigherLower{
		Settings: models.GameSettings{
			UUID:     uuid.NewString(),
			OwnerID:  ownerID,
			GameType: gameType,
		},
	}

	game.Init()
	go game.HandleSocket()

	games[game.Settings.UUID] = &game

	return game

}

func getHigherLowerGame(uuid string) (game *game.HigherLower, err error) {
	for _, v := range games {
		if v.Settings.UUID == uuid {
			game = v
			return
		}
	}
	err = errors.GameNotFound{
		Message: uuid,
	}
	return
}
