import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../infoBar/InfoBar";
import Messages from "../messages/Messages";
import Input from "../input/Input";
import TextContainer from "../textContainer/TextContainer";

let socket;

function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // const ENDPOINT = "localhost:5000";
  const ENDPOINT = "https://chat-on-web-app.herokuapp.com/";

  useEffect(
    function () {
      const { name, room } = queryString.parse(location.search);

      socket = io(ENDPOINT);

      setName(name);
      setRoom(room);

      console.log(socket);
      socket.emit("join", { name, room }, (error) => {
        if (error) {
          alert(error);
        }
      });

      return function cleanUp() {
        socket.emit("disconnect");

        socket.off();
      };
    },
    [ENDPOINT, location.search]
  );

  useEffect(
    function () {
      socket.on("message", (message) => {
        setMessages([...messages, message]);
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    },
    [messages]
  );

  function sendMessage(event) {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  }

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
}

export default Chat;
