package errors

type GameNotFound struct {
	Message string
}

type CouldNotBind struct {
	Message string
}

type OutOfCards struct{}

func (err GameNotFound) Error() string {
	return "Game could not be found:" + err.Message
}

func (err CouldNotBind) Error() string {
	return "Could not bind JSON: " + err.Message
}

func (err OutOfCards) Error() string {
	return "Out of cards."
}
