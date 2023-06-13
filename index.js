const connectToMongo = require("./db");
connectToMongo();
const express = require("express");
const core = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT_NUMBER;

const app = express();
app.use(core());
app.use(express.json());

// --------------Available routes--------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(PORT, () => {
  console.log(`MyNoteBook server listening on port http://localhost:${PORT}`);
});
