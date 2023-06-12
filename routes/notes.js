const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// route 1 : fetch all notes of logged in user using : /api/notes.fetchallnotes-- login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

// route 2 : adding notes using post : /api/notes/addnotes-- login required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 5 }),
    body(
      "description",
      "please enter a description of length more than 5"
    ).isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const result = validationResult(req);

      if (!result) {
        return res.status(500).json({ error: "empty notes can not be added" });
      }

      const savedNotes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      }).save();

      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "internal server error" });
    }
  }
);

// route 3 : updating existing notes using put : /api/notes/updatenotes-- login required

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNotes = {};
    if (title) {
      newNotes.title = title;
    }
    if (description) {
      newNotes.description = description;
    }
    if (tag) {
      newNotes.tag = tag;
    }

    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      res.status(404).send("not found");
    }

    if (notes.user.toString() !== req.user.id) {
      res.status(400).send("not allowed");
    }

    notes = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNotes },
      { new: true }
    );
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

// route 4 : deleting existing notes using put : /api/notes/deletenotes-- login required

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    // find the notes that to be deleted
    let findNotes = await Notes.findById(req.params.id);
    if (!findNotes) {
      return res.status(404).send("not found");
    }
    //  allow deletion only notes belong to the user
    if (findNotes.user.toString() !== req.user.id) {
      return res.status(404).send("not allowed");
    }
    findNotes = await Notes.findByIdAndDelete(req.params.id);
    res.send("notes deleted successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});
module.exports = router;
