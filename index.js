const connectToMongo = require("./db");
connectToMongo();
const express = require("express");
const core = require("cors");

const port = 5000;

const app = express();
app.use(core());
app.use(express.json());

// --------------Available routes--------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`MyNoteBook server listening on port http://localhost:${port}`);
});
