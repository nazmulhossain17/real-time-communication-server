import express, { Express, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MessageRoutes } from "./app/modules/message/message.routes";
import http from "http";
import { initializeSocket } from "./socket/socket";

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1", UserRoutes);
app.use("/message", MessageRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
