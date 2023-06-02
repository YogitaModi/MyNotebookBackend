const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
  title: { type: String, required: true },
  description: { type: string, required: true },

  tag: { type: string, default: "general" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.Model("notes", notesSchema);
