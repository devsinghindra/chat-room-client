import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

let socket;

function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

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

  return <h1>Chat</h1>;
}

export default Chat;
