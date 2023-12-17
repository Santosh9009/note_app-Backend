const express = require("express");
const router = express.Router();
const fetchuser = require("../Middleware/fetchuser");
const Note = require("../Models/Notes");
const { body, validationResult } = require("express-validator");

// Route1: Get all notes using GET:'api/notes/fetchAllNotes'
router.get("/fetchAllNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route2: Add a new note using GET:'api/notes/addnote'
router.post("/addnote", fetchuser, async (req, res) => {
  [
    body("title", "Enter a title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ];

  try {
    const { title, description, tag } = req.body;

    const errors = validationResult(req);
    // returns a bad request if error in request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savednote = await note.save();

    res.json(savednote);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route2: Add a new note using GET:'api/notes/updatenote'
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  const Newnote = {};
  if (title) {
    Newnote.title = title;
  }
  if (description) {
    Newnote.description = description;
  }
  if (tag) {
    Newnote.tag = tag;
  }

  let note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404).send("Not Found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: Newnote },
    { new: true }
  );
  res.json(note);
});

module.exports = router;
