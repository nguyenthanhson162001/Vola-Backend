import express, { Request, Response } from "express";
import "express-async-errors";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import route from "./app/route";
import "./infrastructure/mongoose";
import http from "http";
import Socket from "./app/socket";
const port = Number(process.env.PORT || 5000);
const app = express();
const server = http.createServer(app);

// config socket
new Socket(server);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// Security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use("/api", route);
// 404
app.use("*", (req: Request, res: Response) =>
  res.status(404).send("url not found")
);

server.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});
