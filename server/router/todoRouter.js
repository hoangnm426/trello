const express = require("express");
const todoRouter = express.Router();
const todoController = require("../controller/todoController");

todoRouter.post("/", todoController.createNewTodo);
todoRouter.delete("/:todoid&:tableid", todoController.deleteTodo);

module.exports = todoRouter;
