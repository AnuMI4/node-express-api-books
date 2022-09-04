const express = require('express');
const app = express();
const port = 3000;
const db = require("./db/books");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const jwtToken = jwt.sign({ data: 'foobar' }, 'secret');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader === jwtToken) {
    const bearerToken = bearerHeader;
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/books/authToken", (req, res) => {
  try {
      res.json({
        jwtToken
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
});

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
  try {
    const id = await db.updateBook(req.params.id, req.body);
    res.status(200).json(
      {
        id: req.params.id,
        message: "Book updated successfully"
      });
  } catch (err) {
    let errorString = err.toString();
    console.log(errorString);
    if(errorString.includes("Empty .update() call detected! Update data does not contain any values to update.")) {
      res.status(415).json({
        message: "Unsupported Media Type"
      })
    }
  }
});

app.delete("/books/:id", verifyToken, async (req, res) => {
  jwt.verify(req.token, 'secret', async (err) => {
    try {
      await db.deleteBook(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(403);
    }
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('404 - Not Found');
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});