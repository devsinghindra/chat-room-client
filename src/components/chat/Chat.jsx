import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

let socket;

function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "localhost:5000";

  useEffect(
    function () {
      const { name, room } = queryString.parse(location.search);

      socket = io(ENDPOINT);

      setName(name);
      setRoom(room);

      console.log(socket);
      socket.emit("join", { name, room }, () => {});

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
      <div className="innerContainer">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />
      </div>
    </div>
  );
}

export default Chat;
