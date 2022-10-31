// Create model of todo
// populate to TodoList by todoListId

const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
  // Store table id
  tableId: { type: Schema.Types.ObjectId, ref: "Table" },
  description: String,
});

const Todo = mongoose.model("Todo", todoSchema, "todos");

module.exports = Todo;
