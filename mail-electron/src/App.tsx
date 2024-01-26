import React, { useContext, useEffect } from "react";
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryPage from "./pages/[CategoryId]";
import { SocketContext } from "./contexts/SocketContext";
import { AuthContext } from "./contexts/AuthContext";
import useEmailStore from "./lib/store/Email";

export default function App() {
  const socket = useContext(SocketContext);
  const auth = useContext(AuthContext);
  const emailStore = useEmailStore();

  useEffect(() => {
    if(socket.connected) {
      if(auth.user) {
        console.log('emitting')
        socket.emit("user", auth);
        socket.emit("get:emails",  auth);
        socket.emit("get:boxes", auth);
        socket.on("getback:emails", (data) => {
          console.log(data);
          emailStore.setEmails(data);
        })
      }
    }

    return () => {
      socket.off("user");
      socket.off("get:emails");
      socket.off("get:boxes");
    }
  }, [auth, socket])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/mail/:categoryId" element={<CategoryPage />} />
    </Routes>
  );
}