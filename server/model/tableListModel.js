// Create model of tableList
// populate to table by tableId
// store tableId

const mongoose = require("mongoose");
const { Schema } = mongoose;

const tableListSchema = new Schema({
  // Store id of tables in order to change 
  tableId: [{ type: Schema.Types.ObjectId, ref: "Table" }],
});

const TableList = mongoose.model("TableList", tableListSchema, "tableidlist");

module.exports = TableList;
