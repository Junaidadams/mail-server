import express from "express";
import cors from "cors";
import mailRoute from "./routes/mail.routes.js";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(
  cors({
    origin: ["https://junaidadams.com"],
    credentials: true,
  })
);

app.get("/ping", (req, res) => {
  res.status(200).send("Ok");
});

app.use("/api/mail", mailRoute);

app.listen(8800, () => {
  console.log("Server is running on port 8800.");
});
