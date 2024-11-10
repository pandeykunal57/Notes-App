import React, { useState, useEffect } from "react";
import axios from "axios";
import ToDoItem from "./ToDoItem";
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import for animation

function App() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);

  // Fetch to-do items from backend
  useEffect(() => {
    axios.get("http://localhost:5002/todos")
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the to-dos!", error);
      });
  }, []);

  // Handle input change
  function handleChange(event) {
    setInputText(event.target.value);
  }

  // Add a new item
  function addItem() {
    if (inputText.trim()) {
      axios.post("http://localhost:5002/todos", { text: inputText })
        .then(response => {
          setItems(prevItems => [...prevItems, response.data]);
          setInputText(""); // Reset input after adding
        })
        .catch(error => {
          console.error("There was an error adding the to-do item!", error);
        });
    }
  }

  // Mark item as completed (move to bottom)
  function markComplete(id) {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });

      // Move completed items to the bottom
      const completedItems = updatedItems.filter(item => item.completed);
      const incompleteItems = updatedItems.filter(item => !item.completed);
      return [...incompleteItems, ...completedItems];
    });
  }

  // Delete item
  function handleDelete(id) {
    axios.delete(`http://localhost:5002/todos/${id}`)
      .then(() => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the to-do item!", error);
      });
  }

  // Edit item
  function handleEdit(id, newText) {
    axios.put(`http://localhost:5002/todos/${id}`, { text: newText })
      .then(response => {
        setItems(prevItems => {
          const updatedItems = prevItems.map(item =>
            item.id === id ? { ...item, text: newText } : item
          );
          return updatedItems;
        });
      })
      .catch(error => {
        console.error("There was an error updating the to-do item!", error);
      });
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input onChange={handleChange} type="text" value={inputText} />
        <button onClick={addItem} className="add-button">
          Add
        </button>
      </div>
      <div>
        <TransitionGroup>
          {items.map((todoItem) => (
            <CSSTransition
              key={todoItem.id}
              timeout={500} // Set the animation time for smooth transition
              classNames="item"
            >
              <ToDoItem
                id={todoItem.id}
                text={todoItem.text}
                completed={todoItem.completed}
                onChecked={markComplete}
                onDelete={handleDelete}
                onEdit={handleEdit} // Pass the onEdit handler to ToDoItem
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
}

export default App;
