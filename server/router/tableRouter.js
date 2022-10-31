const express = require("express");
const tableRouter = express.Router();
const tableController = require("../controller/tableController");

tableRouter.get("/", tableController.getAllTables);
tableRouter.post("/", tableController.createTable);
tableRouter.delete("/:id", tableController.deleteTableById);
tableRouter.put("/update", tableController.updateTableOrder);
tableRouter.put("/update/twotable", tableController.updateTwoTable);
tableRouter.get("/get/:tableid", tableController.getTodoId);
tableRouter.put("/update/table/", tableController.updateTodoIdSameTable);

module.exports = tableRouter;
