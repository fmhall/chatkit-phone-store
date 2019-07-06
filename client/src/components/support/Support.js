import React, { Component } from "react";
import axios from "axios";
import Chatkit from "@pusher/chatkit-client";
import { sendMessage, handleInput, connectToRoom } from "./sharedMethods";

import "./Support.css";

class Support extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: 'customer',
      currentRoom: '24648809',
      newMessage: "",
      messages: [],
      rooms: []
    };

    this.sendMessage = sendMessage.bind(this);
    this.handleInput = handleInput.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
  }

  componentDidMount() {
    const userId = "customer";

    axios
      .post("http://localhost:5200/users", { userId })
      .then(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: "http://localhost:5200/authenticate"
        });

        const chatManager = new Chatkit.ChatManager({
          instanceLocator: "v1:us1:57a9caaa-c37f-4a48-8d2f-33e48e80e81a",
          userId,
          tokenProvider
        });

        return chatManager
          .connect({
            onAddedToRoom: room => {
              this.setState({
                rooms: [...this.state.rooms, room]
              });
            }
          })
          .then(currentUser => {
            this.setState(
              {
                currentUser,
                rooms: currentUser.rooms
              },
              () => {
                if (this.state.rooms.length >= 1) {
                  this.connectToRoom(this.state.rooms[0].id);
                }
              }
            );
          });
      })
      .catch(console.error);
  }

  joinRoom = id => {
    this.setState(
      {
        messages: []
      },
      () => this.connectToRoom(id)
    );
  };

  render() {
    const {
      newMessage,
      rooms,
      currentRoom,
      messages,
      currentUser
    } = this.state;

    const RoomList = rooms.map(room => {
      const isActive =
        currentRoom && currentRoom.id === room.id ? "active" : "";
      return (
        <li
          key={room.id}
          onClick={() => this.joinRoom(room.id)}
          className={`${isActive} room`}
        >
          {room.name}
        </li>
      );
    });

    const ChatSession = messages.map((message, index) => {
      const user = message.senderId === currentUser.id ? "support" : "user";
      return (
        <p key={index} className={`${user} message`}>
          {message.text}
        </p>
      );
    });

    return (
      <div className="support-area">
        <aside className="support-sidebar">
          <h3>Rooms</h3>
          <ul>{RoomList}</ul>
        </aside>
        <section className="support-session">
          <header className="current-chat">
            <h3>{currentRoom ? currentRoom.name : "Chat"}</h3>
          </header>
          <div className="chat-session">{ChatSession}</div>
          <form onSubmit={this.sendMessage} className="message-form">
            <input
              autoFocus
              placeholder="Compose your message and hit ENTER to send"
              onChange={this.handleInput}
              value={newMessage}
              name="newMessage"
            />
          </form>
        </section>
      </div>
    );
  }
}

export default Support;