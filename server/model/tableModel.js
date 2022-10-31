// Create model of table
// populate to todoList by todoListId
// populate to tableList by tableListId

const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableSchema = new Schema({
  // store id of table list
  tableListId: { type: Schema.Types.ObjectId, ref: "TableList" },
  // store id of todo which include in table
  todoId: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  name: String,
});

const Table = mongoose.model("Table", tableSchema, "tablelist");

module.exports = Table;
