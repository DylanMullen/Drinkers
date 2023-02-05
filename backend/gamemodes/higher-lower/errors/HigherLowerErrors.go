package errors

type CouldNotCreate struct {
}

type PlayerNotFound struct {
	UUID string
}

type GameNotFound struct {
	UUID string
}

func (error PlayerNotFound) Error() string {
	return "Player could not be found: " + error.UUID
}

func (error CouldNotCreate) Error() string {
	return "Could not create Game"
}

func (error GameNotFound) Error() string {
	return "Game could not be found: " + error.UUID
}
