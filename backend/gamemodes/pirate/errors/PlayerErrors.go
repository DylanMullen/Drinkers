package errors

type PlayerNotFound struct {
	UUID string
}

func (error PlayerNotFound) Error() string {
	return "Player could not be found: " + error.UUID
}
