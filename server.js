import express from "express";
import cors from "cors";
import pkg from 'pg';
import path from 'path';

const { Client } = pkg;

const app = express();
const port = 5002; // Run backend on port 5002

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Set up PostgreSQL client
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "to_do",
  password: "kunal@36",
  port: 5432, // Default port for PostgreSQL
});

client.connect();

// API to fetch all to-do items
app.get("/todos", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todo_items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving to-do items");
  }
});

// API to add a new to-do item
app.post("/todos", async (req, res) => {
  const { text } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO todo_items (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to-do item");
  }
});

// API to delete a to-do item
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM todo_items WHERE id = $1", [id]);
    res.status(200).send("To-do item deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting to-do item");
  }
});

// API to update a to-do item
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const result = await client.query(
      "UPDATE todo_items SET text = $1 WHERE id = $2 RETURNING *",
      [text, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating to-do item");
  }
});

// Serve static files from React app (if in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
