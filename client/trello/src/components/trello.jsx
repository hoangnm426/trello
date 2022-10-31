import { React, useState, useEffect, useRef } from "react";
import axios from "axios";

function Trello() {
  // Set default new todo input text
  const [newTodoInputText, setNewTodoInputText] = useState("");

  // Set default new table input text
  const [newTableInputText, setNewTableInputText] = useState("");

  // Set change defaut state
  const [change, setChange] = useState(false);

  // Set tableList default state
  const [tableList, setTableList] = useState([]);

  // Set default new table
  const [newTable, setNewTable] = useState({
    name: "",
  });

  // Set default new todo
  const [newTodo, setNewTodo] = useState({
    tableId: "",
    description: "",
  });

  // set default state table id array
  const [tableArray, setTableArray] = useState([]);

  // set from and to table id
  let fromTableIdRef = useRef();
  let toTableIdRef = useRef();

  // set from and to todo id
  let fromTodoId = useRef();
  let toTodoId = useRef();

  // Set from and to table id
  let fromTodoTableId = useRef();
  let toTodoTableId = useRef();

  // Function fetch all tables from database
  function getAllTables() {
    axios
      .get("http://localhost:8080/api/table")
      .then((response) => {
        const resTableList = response.data.tableList;
        const resTableArray = response.data.tableArray;
        setTableArray(resTableArray);
        setTableList(resTableList);
      })
      .catch((error) => console.log(error));
  }

  // fectch data from database
  useEffect(() => {
    getAllTables();
  }, [change]);

  // Function handle new table input text
  const handleNewTableInputText = (e) => {
    let text = e.target.value;
    setNewTableInputText(text);
  };

  // Function handle new todo input text
  const handleNewTodoInputText = (e) => {
    let text = e.target.value;
    setNewTodoInputText(text);
  };

  // Function handle new table button
  const handleNewTableButton = (e) => {
    // validate new table input text
    if (newTableInputText === "") {
      alert("Tên table không để trống");
      return;
    }

    // Set newTableInputText to newTable
    newTable.name = newTableInputText;

    // send request to server
    axios
      .post("http://localhost:8080/api/table/", newTable)
      .then((response) => {
        e.target.closest("div").style.display = "none";
        e.target.closest("div").previousSibling.style.display = "block";
        setNewTableInputText("");
        // Reset newTable
        setNewTable({
          name: "",
        });
        setChange(!change);
      });
  };

  // Function handle new table open button
  const handleNewTableOpenButton = () => {
    document.querySelector("#create-new-column").style.display = "none";
    document.querySelector(".input-new-todo-column").style.display = "block";
  };

  // Function handle new table close button
  const handleNewTableCloseButton = (e) => {
    document.querySelector("#input-column-name").value = "";
    document.querySelector("#create-new-column").style.display = "block";
    document.querySelector(".input-new-todo-column").style.display = "none";
  };

  // Function handle delete table button
  const handleDeleteTableButton = (e) => {
    const tableId = e.target.dataset.tableid;

    // Send request to server
    axios
      .delete(`http://localhost:8080/api/table/${tableId}`)
      .then((response) => {
        setChange(!change);
      });
  };

  // Function handle new todo open button
  const handleNewTodoOpenButton = (e) => {
    e.target.nextSibling.style.display = "block";
    e.target.style.display = "none";
  };

  // Function handle new todo close button
  const handleNewTodoCloseButton = (e) => {
    e.target.closest("div").style.display = "none";
    e.target.closest("div").previousSibling.style.display = "block";
    e.target.previousSibling.previousSibling.value = "";
  };

  // Function handle new todo button
  const handleNewTodoButton = (e) => {
    // validate new todo input text
    if (e.target.previousSibling.value === "") {
      alert("Task không để trống");
      return;
    }

    const tableId = e.target.dataset.tableid;
    // Set tableId to newTodo
    newTodo.tableId = tableId;

    // Set newTodoInputText to newTodo
    newTodo.description = newTodoInputText;

    // send request to server
    axios
      .post("http://localhost:8080/api/todos", {
        newTodo: newTodo,
        tableId: tableId,
      })
      .then((respone) => {
        // Clear input
        e.target.previousSibling.value = "";
        setChange(!change);
        setNewTodoInputText("");
        // reset newTodo
        setNewTodo({
          description: "",
        });
      });
  };

  // Function delete todo
  const deleteTodo = (e) => {
    // set id to delete id
    const todoId = e.target.dataset.todoid;
    const tableId = e.target.dataset.tableid;

    // send request to server
    axios
      .delete(`http://localhost:8080/api/todos/${todoId}&${tableId}`)
      .then((respone) => {
        setChange(!change);
      });
  };

  // Function handle todo drag start
  const handleTodoDragStart = (e) => {
    fromTodoTableId = e.target.dataset.tableid;
    fromTodoId = e.target.dataset.todoid;
  };

  // Function handle todo drag enter
  const handleTodoDragEnter = (e) => {
    toTodoTableId = e.target.dataset.tableid;
    toTodoId = e.target.dataset.todoid;
  };

  // Function handle todo drag end
  const handleTodoDragEnd = (e) => {
    e.stopPropagation();

    // Same table
    if (fromTodoTableId === toTodoTableId) {
      axios
        .get(`http://localhost:8080/api/table/get/${fromTodoTableId}`)
        .then((respone) => {
          const resTodoIdArray = respone.data;
          // Find fromTodoId index
          const fromTodoIdIndex = resTodoIdArray.findIndex(
            (id) => id === fromTodoId
          );
          // Find toTodoId index
          const toTodoIdIndex = resTodoIdArray.findIndex(
            (id) => id === toTodoId
          );

          // Element to change
          const todoElement = resTodoIdArray[fromTodoIdIndex];
          // change array
          resTodoIdArray.splice(fromTodoIdIndex, 1);
          resTodoIdArray.splice(toTodoIdIndex, 0, todoElement);

          // Set request object
          const reqObj = {
            tableId: fromTodoTableId,
            todoIdArray: resTodoIdArray,
          };

          // Send new array to server to update
          axios
            .put("http://localhost:8080/api/table/update/table", reqObj)
            .then((response) => {
              setChange(!change);
            });
        });
    }

    // Different table
    if (fromTodoTableId !== toTodoTableId) {
      const fromObj = {
        fromTodoTableId: fromTodoTableId,
        fromTodoId: fromTodoId,
      };

      const toObj = { toTodoTableId: toTodoTableId, toTodoId: toTodoId };

      const fromToObj = { fromObj: fromObj, toObj: toObj };

      axios
        .put(`http://localhost:8080/api/table/update/twotable`, fromToObj)
        .then((respone) => {
          setChange(!change);
        });
    }
  };

  // Function handle table drag start
  const handleTableDragStart = (e) => {
    fromTableIdRef = e.target.dataset.tableid;
  };

  // Function handle table drag enter
  const handleTableDragEnter = (e) => {
    toTableIdRef = e.target.dataset.tableid;
  };

  // Function handle table drag end
  const handleTableDragEnd = (e) => {
    // clone table array
    const cloneTableArray = [...tableArray];
    // Find the from table id index
    const fromTableIdIndex = tableArray.findIndex(
      (id) => id === fromTableIdRef
    );
    // Find the to table id index
    const toTableIdIndex = tableArray.findIndex((id) => id === toTableIdRef);
    // Element to change
    const tableElement = cloneTableArray[fromTableIdIndex];
    // change clone table id array
    cloneTableArray.splice(fromTableIdIndex, 1);
    cloneTableArray.splice(toTableIdIndex, 0, tableElement);

    // Send to server to update
    axios
      .put("http://localhost:8080/api/table/update", cloneTableArray)
      .then((response) => {
        setChange(!change);
      });
  };

  return (
    <div className="container">
      <div id="header">
        <h1>Trello App</h1>
      </div>

      <div id="todo-list-container">
        <div id="todo-list-main">
          {tableList.map((table, index) => (
            <div
              className="todo-column"
              key={index}
              data-tableid={table._id}
              data-index={index}
              draggable
              onDragStart={handleTableDragStart}
              onDragEnter={handleTableDragEnter}
              onDragEnd={handleTableDragEnd}
            >
              <div className="column-header" data-tableid={table._id}>
                <p className="col-9" data-tableid={table._id}>
                  {table.name}
                </p>
                <button
                  type="button"
                  data-tableid={table._id}
                  onClick={handleDeleteTableButton}
                >
                  Delete
                </button>
              </div>

              <ul className="todo-list" data-tableid={table._id}>
                <li
                  id="hidden-li"
                  key={index}
                  className="todo-element"
                  data-tableid={table._id}
                  draggable
                  onDragStart={handleTodoDragStart}
                  onDragEnter={handleTodoDragEnter}
                ></li>
                {table.todoId.map((todo, index) => (
                  <li
                    key={index}
                    className="todo-element"
                    data-tableid={table._id}
                    data-todoid={todo._id}
                    draggable
                    onDragStart={handleTodoDragStart}
                    onDragEnter={handleTodoDragEnter}
                    onDragEnd={handleTodoDragEnd}
                  >
                    <p
                      className="col-9"
                      data-tableid={table._id}
                      data-todoid={todo._id}
                    >
                      {todo.description}
                    </p>
                    <button
                      type="button"
                      data-tableid={table._id}
                      data-todoid={todo._id}
                      onClick={deleteTodo}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>

              <div className="column-action" data-tableid={table._id}>
                <button
                  id="create-new-todo"
                  data-tableid={table._id}
                  onClick={handleNewTodoOpenButton}
                >
                  Thêm mới todo
                </button>
                <div id="input-todo-name" style={{ display: "none" }}>
                  <input
                    placeholder="Nhập tiêu đề danh sách..."
                    data-index={index}
                    onChange={handleNewTodoInputText}
                  />
                  <button
                    type="button"
                    className="create-new-todo-btn"
                    data-tableid={table._id}
                    onClick={handleNewTodoButton}
                  >
                    Thêm mới
                  </button>
                  <button
                    type="button"
                    className="close-new-todo-btn"
                    onClick={handleNewTodoCloseButton}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="add-column">
            <button
              id="create-new-column"
              style={{ display: "block" }}
              onClick={handleNewTableOpenButton}
            >
              Thêm bảng mới
            </button>
            <div className="input-new-todo-column" style={{ display: "none" }}>
              <input
                id="input-column-name"
                placeholder="Nhập tiêu đề danh sách..."
                onChange={handleNewTableInputText}
                value={newTableInputText}
              />
              <button
                type="button"
                id="create-new-column-btn"
                onClick={handleNewTableButton}
              >
                Thêm danh sách
              </button>
              <button
                type="button"
                id="close-new-column-btn"
                onClick={handleNewTableCloseButton}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trello;
