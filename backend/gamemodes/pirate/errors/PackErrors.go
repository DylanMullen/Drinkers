package errors

type PackNotFound struct {
	UUID string
}

func (pack PackNotFound) Error() string {
	return "Pack could not be found: " + pack.UUID
}
