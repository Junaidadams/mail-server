import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [],
    credentials: true,
  })
);

app.use("/ping", cors(), (req, res) => {
  res.status(200).send("Ok");
});

app.use("/api/test");

app.listen(8800, () => {
  console.log("Server is running.");
});
