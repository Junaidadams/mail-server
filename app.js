import express from "express";
import cors from "cors";
import mailRoute from "./routes/mail.routes.js";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://junaidadams.com",
      "www.junaidadams.com",
      "https://withinreach.co.za",
      "www.withinreach.co.za",
    ],

    //  // List all allowed origins
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
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
