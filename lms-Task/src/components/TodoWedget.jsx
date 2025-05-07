import React, { useState } from "react";
import dayjs from "dayjs";
import { Plus } from "lucide-react";

const TodoWidget = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
      date: dayjs().format("YYYY-MM-DD"),
    };
    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && todo.completed) ||
      (filterStatus === "incomplete" && !todo.completed);

    const matchesDate = filterDate === "" || todo.date === filterDate;

    return matchesStatus && matchesDate;
  });

  return (
    <div className="w-full max-w-[350px] bg-white rounded-xl shadow p-6 text-sm">
      <h2 className="text-base font-semibold mb-6 text-gray-800">To-Do List</h2>

      {/* Input section */}
      <div className="flex flex-row gap-4 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button
          onClick={addTodo}
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
        >
          <Plus />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-between">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-full px-3 py-2"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded-full px-3 py-2"
        />
      </div>

      {/* Task List */}
      {filteredTodos.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks match the filter.</p>
      ) : (
        <ul className=" max-h-80 overflow-y-auto pr-1">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex justify-between items-center p-2 border-b border-neutral-400 ${
                todo.completed ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="mt-1"
                />
                <div>
                  <p
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    } font-medium text-base`}
                  >
                    {todo.text}
                  </p>
                  <span className="text-xs text-gray-500">
                    Date: {todo.date}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoWidget;
