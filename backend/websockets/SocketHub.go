package websockets

type SocketHub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

func GetNewHub() *SocketHub {
	return &SocketHub{
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (h *SocketHub) Close() {

	h.closeClients()

	h.Clients = nil
	h.Broadcast = nil
	h.Register = nil
	h.Unregister = nil
}

func (h *SocketHub) closeClients() {
	for client := range h.Clients {
		client.ShouldDie = true
	}
}

func (h *SocketHub) BroadcastMessage(id string, message []byte) {
	for client := range h.Clients {

		if id != "" && client.Id == id {
			continue
		}

		select {
		case client.Send <- message:
		default:
			close(client.Send)
			delete(h.Clients, client)
		}
	}
}

func (h *SocketHub) GetClient(id string) (client *Client) {
	for v := range h.Clients {
		if v.Id == id {
			client = v
			return
		}
	}
	return
}

func (h *SocketHub) GetClientByUUID(uuid string) (client *Client) {
	for v := range h.Clients {
		if v.UUID == uuid {
			client = v
			return
		}
	}
	return
}
