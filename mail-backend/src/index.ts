// @ts-nocheck

import express from "express";
import dotenv from "dotenv";
import authController from "./routes/auth/controllers/index";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import EmailManager from "./managers/EmailManager";
import * as http from "http";
import { db } from "./db";

const imapConfig = {
  user: "nagariawaleed@gmail.com",
  password: "Waleed7867$",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
};
dotenv.config();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();
const httpsServer = http.createServer(app);
const port = process.env.PORT;

let emailManager;

app.use(cors());

const io = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
});

emailManager = new EmailManager(io);
// io.on("connection", (socket) => {
// });

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.post("/api/auth/register", authController.createUser);
app.post("/api/auth/login", authController.loginUser);
app.get("/api/auth", async (req, res) => {
  let headerToken = req.headers.authorization;
  if (headerToken) {
    headerToken = headerToken.split(" ")[1];
    jwt.verify(headerToken, process.env.JWT_SECRET!, async (err, decoded) => {
      if (err) return res.json({ user: null });
      console.log(decoded, "decoded");
      if(!decoded || !decoded.id) return res.json({ user: null });
      const user = await db.user.findFirst({ where: { id: decoded.id } });

      if(!user) return res.json({ user: null });

      return res.json({ user });
    });
  }
});

httpsServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export { app };
