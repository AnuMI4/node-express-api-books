const express = require('express');
const app = express();
const port = process.env.port || 3000;
const db = require("./db/books");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Books API');
});

app.post("/books", async (req, res) => {
  const results = await db.createBook(req.body);
  res.status(201).json({ id: results[0] });
});

app.get("/books", async (req, res) => {
  const books = await db.getAllBooks();
  res.status(200).json({ books });
});

app.put("/books/:id", async (req, res) => {
  const id = await db.updateBook(req.params.id, req.body);
  res.status(200).json({ id });
});

app.delete("/books/:id", async (req, res) => {
  await db.deleteBook(req.params.id);
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`)
});