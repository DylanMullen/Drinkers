set -xe

# go get github.com/gin-gonic/gin
# go get github.com/gin-contrib/cors
# go get github.com/gorilla/websocket
# go get github.com/buger/jsonparser
# go get github.com/google/uuid

go get ./...

go build -o bin/application application.go