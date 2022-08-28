const express = require('express');
const app = express();
const port = 3000;
const db = require("./db/books");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Books API');
});

app.post("/books", async (req, res) => {
  try {
    const results = await db.createBook(req.body);
    res.status(201).json(
    {
      id: results[0],
      message: "Book added successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error.toString()
    });
  }
});

app.get("/books", async (req, res) => {
  const books = await db.getAllBooks();
  res.status(200).json({ books });
});

app.put("/books/:id", async (req, res) => {
  const id = await db.updateBook(req.params.id, req.body);
  res.status(200).json(
    {
      id: req.params.id,
      message: "Book updated successfully"
    });
});

app.delete("/books/:id", async (req, res) => {
  await db.deleteBook(req.params.id);
  res.status(200).json({ success: true });
});

app.use((req, res) => {
  res.status(404);
  res.send('404 - Not Found');
});

app.listen(port, () => {
  console.log(`server started on port ${port}`)
});