import React, { useState } from "react";

function ToDoItem({ id, text, completed, onChecked, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  // Handle change when text is being edited
  function handleChange(event) {
    setNewText(event.target.value);
  }

  // Handle save of edited text
  function handleSave() {
    if (newText.trim()) {
      onEdit(id, newText);
      setIsEditing(false);
    }
  }

  return (
    <li
      className={`todo-item ${completed ? "completed" : ""}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={handleChange}
          onBlur={handleSave} // Save on blur if user clicks outside the input
          autoFocus
          style={{ flexGrow: 1 }}
        />
      ) : (
        <span onClick={() => onChecked(id)} style={{ flexGrow: 1 }}>
          {text}
        </span>
      )}

      {/* Edit icon */}
      <i
        className="fas fa-edit"
        style={{
          cursor: "pointer",
          color: "blue",
          fontSize: "1.5rem",
          marginLeft: "10px",
        }}
        onClick={() => setIsEditing(true)} // Enable editing when clicked
      ></i>

      {/* Delete icon */}
      <i
        className="fas fa-trash-alt"
        style={{
          cursor: "pointer",
          color: "red",
          fontSize: "1.5rem",
          marginLeft: "10px",
        }}
        onClick={() => onDelete(id)}
      ></i>
    </li>
  );
}

export default ToDoItem;
