const Table = require("../model/tableModel");
const TableList = require("../model/tableListModel");
const Todo = require("../model/todoModel");

// Set default tableListId
const tableListId = "62bd61da3e316a2727955306";

// Function get all table
const getAllTables = async (req, res) => {
  try {
    // get all data
    const tableID = await TableList.findById(tableListId).populate({
      path: "tableId",
      populate: { path: "todoId" },
    });

    const tableIdArray = await TableList.findById(tableListId);
    const tableArray = tableIdArray.tableId;

    // set table list
    const tableList = tableID.tableId;

    res.status(200).send({ tableList: tableList, tableArray: tableArray });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

// Function create new table
const createTable = async (req, res) => {
  const reqNewTableObj = req.body;
  try {
    // Create a new table
    const newTable = new Table({
      tableListId: tableListId,
      name: reqNewTableObj.name,
    });

    // Save new table to database
    await newTable.save();

    // Find the tableListId from database
    const tableListIdDb = await TableList.findById(tableListId);
    // Push new tableId to tableListId
    tableListIdDb.tableId.push(newTable._id);
    await tableListIdDb.save();

    res.status(200).send(newTable);
  } catch (error) {
    res.status(404).send(error);
  }
};

// Function delete table base on id
const deleteTableById = async (req, res) => {
  try {
    // Request table id
    const reqId = req.params.id;
    // Find the table from database base on id
    const findTable = await Table.findById({ _id: reqId });

    // Delete table base on id
    await Table.deleteOne({ _id: reqId });

    //Find the tableListId from database
    const tableListIdDb = await TableList.findById(tableListId);
    // Remove id from list
    tableListIdDb.tableId.pull(reqId);

    await tableListIdDb.save();

    // Delete all todos related to table
    await Todo.deleteMany({ tableId: reqId });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

// Function update table order
const updateTableOrder = async (req, res) => {
  try {
    // Request new order table array
    const reqTableArray = await req.body;
    // Find original table array
    const originalTableArray = await TableList.findById(tableListId);

    // update table array order
    await TableList.updateOne(originalTableArray, { tableId: reqTableArray });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

// Function get fromTable and toTable to change
const updateTwoTable = async (req, res) => {
  try {
    // request object
    const reqObj = await req.body;

    const fromObj = reqObj.fromObj;
    const toObj = reqObj.toObj;

    const fromTableId = fromObj.fromTodoTableId;
    const toTableId = toObj.toTodoTableId;

    const fromTodoId = fromObj.fromTodoId;
    const toTodoId = toObj.toTodoId;

    // Find from table
    const fromTableDb = await Table.findById(fromTableId);
    // Get todoId array from fromTable
    const fromTodoIdArray = fromTableDb.todoId;
    // clone fromTodoIdArray
    const cloneFromTodoIdArray = [...fromTodoIdArray];
    // Find fromTodoIdIndex
    const fromTodoIdIndex = fromTodoIdArray.findIndex((id) => id == fromTodoId);

    // Find to table
    const toTableDb = await Table.findById(toTableId);
    // Get todoId array form toTable
    const toTodoIdArray = toTableDb.todoId;
    // Clone toTodoIdArray
    const cloneToTodoIdArray = [...toTodoIdArray];
    // Find toTodoIdIndex
    const toTodoIdIndex = toTodoIdArray.findIndex((id) => id == toTodoId);

    // Change todoId array
    cloneFromTodoIdArray.splice(fromTodoIdIndex, 1);

    cloneToTodoIdArray.splice(toTodoIdIndex, 0, fromTodoId);

    await Table.updateOne(fromTableDb, { todoId: cloneFromTodoIdArray });
    await Table.updateOne(toTableDb, { todoId: cloneToTodoIdArray });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

// Function get todoId in the same table
const getTodoId = async (req, res) => {
  try {
    // Request tableId from url
    const tableId = await req.params.tableid;
    // Find table base on id
    const tableDb = await Table.findById(tableId);

    // Get todoId array
    const todoIdArray = tableDb.todoId;

    res.status(200).send(todoIdArray);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

// Function update todoId order in the same table
const updateTodoIdSameTable = async (req, res) => {
  try {
    // Request Obj
    const reqObj = await req.body;
    // Request tableId
    const tableId = reqObj.tableId;
    // Request todoIdArray
    const newTodoIdArray = reqObj.todoIdArray;

    // Find table from database base on id
    const tableDb = await Table.findById(tableId);

    // Update table
    await Table.updateOne(tableDb, { todoId: newTodoIdArray });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

module.exports = {
  createTable,
  getAllTables,
  deleteTableById,
  updateTableOrder,
  updateTwoTable,
  getTodoId,
  updateTodoIdSameTable,
};
