const { Book, Comment } = require("../../../db");
const api = require("../../../../api/Books.json");

const readBooks = async () => {
  try {
    const verifyDb = await Book.findAll({
      include: [{ model: Comment, as: "comments" }],
    });

    if (verifyDb.length === 0) {
      console.log(
        "La base de datos está vacía. Se procederá a llenarla con la información de books.json."
      );

      const dbDataBooks = [];

      for (let book of api) {
        const apiData = {
          title: book.volumeInfo.title || "Title not Available",
          author: book.volumeInfo.authors
            ? book.volumeInfo.authors
            : ["Author not Available"],
          country: book.accessInfo.country,
          language: book.volumeInfo.language,
          image: book.volumeInfo.imageLinks?.thumbnail || "Image not Available",
          gender: book.volumeInfo.categories
            ? book.volumeInfo.categories
            : ["Gender not Available"],
          sinopsis: book.volumeInfo.description || "Sinopsis not available.",
          price: book.saleInfo.listPrice?.amount || 0.0,
          publishedDate: book.volumeInfo.publishedDate || "Published Date not available",
          pdfLink: book.volumeInfo.previewLink,
          editorial: book.volumeInfo.publisher || "Publisher not available",
          numPages: book.pageCount || 0,
        };

        const createdBook = await Book.create(apiData, {
          include: [{ model: Comment, as: "comments" }],
        });
        dbDataBooks.push(createdBook);
      }

      return dbDataBooks;
    } else {
      console.log(
        "La base de datos ya contiene información. Se mostrarán los datos existentes."
      );
      return verifyDb;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  readBooks,
};