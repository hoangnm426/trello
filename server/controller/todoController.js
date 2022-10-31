const Todo = require("../model/todoModel");
const Table = require("../model/tableModel");

const createNewTodo = async (req, res) => {
  try {
    // request obj
    const reqObj = req.body;
    const newTodo = new Todo({
      tableId: reqObj.newTodo.tableId,
      description: reqObj.newTodo.description,
    });
    // save new todo to database
    await newTodo.save();

    const tableId = reqObj.tableId;
    // Find the table base on id
    const todoTable = await Table.findById(tableId);
    // Push new todo id to array of table
    todoTable.todoId.push(newTodo._id);
    await todoTable.save();

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

const deleteTodo = async (req, res) => {
  try {
    // request todo id to delete
    const todoId = req.params.todoid;
    // request table id to pull todo id
    const tableId = req.params.tableid;

    // Delete todo base on id
    await Todo.deleteOne({ _id: todoId });

    // Find the table which delete todo in
    const todoTable = await Table.findById(tableId);
    // remove todo id form the list
    todoTable.todoId.pull(todoId);

    await todoTable.save();

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

module.exports = { createNewTodo, deleteTodo };
