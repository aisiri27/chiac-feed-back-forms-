const mongoose = require("mongoose");

// Question schema (embedded)
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["rating", "text"],
    default: "rating"
  },

  required: {
    type: Boolean,
    default: true
  }
});


// Main form schema
const formSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    unique: true   // one form per event
  },

  questions: [questionSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Form", formSchema);
