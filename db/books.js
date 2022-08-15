const knex = require("./knex");

function createBook(book) {
  return knex("books").insert(book);
};

function getAllBooks() {
  return knex("books").select("*");
};

function updateBook(id, book) {
  return knex("books").where("id", id).update(book);
};


function deleteBook(id) {
  return knex("books").where("id", id).del();
};

module.exports = {
  createBook,
  getAllBooks,
  deleteBook,
  updateBook
}