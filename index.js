const connectToMongo = require("./db");
connectToMongo();
const express = require("express");

const port = 3000;

const app = express();

app.use(express.json());

// --------------Available routes--------------
app.use("/api/auth", require("./routers/auth"));
app.use("/api/notes", require("./routers/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
