const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


function getBooks() {
  return new Promise((resolve, reject) => {
    // Simulamos un pequeño delay
    setTimeout(() => {
      if (!books || Object.keys(books).length === 0) {
        reject("No books available");
      } else {
        resolve(books);
      }
    }, 100); // 100ms de delay simulado
  });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBooks()
    .then((bookList) => {
      res.status(200).json(bookList);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});


// public_users.get('/',function (req, res) {
//   //Write your code here
//   let jsonBooks = JSON.stringify(books);
//   if (!jsonBooks || jsonBooks === '{}') {
//     return res.status(404).json({ message: "No books available" });
//   }
//   return res.status(200).json(books);
// });


// Simulamos una función que busca un libro por ISBN usando una Promesa
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let jsonBooks = JSON.stringify(books);

      if (!jsonBooks || jsonBooks === '{}') {
        reject("No books available");
      } else if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 100); // Simulamos un pequeño delay
  });
}

// Endpoint usando Promesa con callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((errorMessage) => {
      res.status(404).json({ message: errorMessage });
    });
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   let jsonBooks = JSON.stringify(books);
//   if (!jsonBooks || jsonBooks === '{}') {
//     return res.status(404).json({ message: "No books available" });
//   }

//   if (books[req.params.isbn]) {
//     return res.status(200).json(books[req.params.isbn]);
//   }else{
//     return res.status(404).json({ message: "Book not found" });
//   }

//  });
  

// Simulamos una función que busca libros por autor usando una Promesa
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let jsonBooks = JSON.stringify(books);

      if (!jsonBooks || jsonBooks === '{}') {
        return reject("No books available");
      }

      let booksbyauthor = [];

      for (let isbn in books) {
        if (books[isbn].author === author) {
          let bookcopy = { ...books[isbn], isbn };
          booksbyauthor.push(bookcopy);
        }
      }

      if (booksbyauthor.length > 0) {
        resolve(booksbyauthor);
      } else {
        reject("Book not found");
      }
    }, 100); // Simulamos asincronía con un pequeño delay
  });
}

// Endpoint usando Promesa con callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  getBooksByAuthor(author)
    .then((booksFound) => {
      res.status(200).json(booksFound);
    })
    .catch((errorMessage) => {
      res.status(404).json({ message: errorMessage });
    });
});

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   let jsonBooks = JSON.stringify(books);
//   if (!jsonBooks || jsonBooks === '{}') {
//     return res.status(404).json({ message: "No books available" });
//   }

//   let booksbyauthor = [];
//   for (let isbn in books) {
//     if (books[isbn].author === req.params.author) {
//       let bookcopy = books[isbn];
//       bookcopy.isbn = isbn;
//       booksbyauthor.push(bookcopy);
//     }
//   }

//   if (booksbyauthor.length > 0) {
//     return res.status(200).json(booksbyauthor);
//   }else{
//     return res.status(404).json({ message: "Book not found" });
//   }

// });

// Simulamos una función que busca libros por título usando una Promesa
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let jsonBooks = JSON.stringify(books);

      if (!jsonBooks || jsonBooks === '{}') {
        return reject("No books available");
      }

      let booksbytitle = [];

      for (let isbn in books) {
        if (books[isbn].title === title) {
          let bookcopy = { ...books[isbn], isbn };
          booksbytitle.push(bookcopy);
        }
      }

      if (booksbytitle.length > 0) {
        resolve(booksbytitle);
      } else {
        reject("Book not found");
      }
    }, 100); // Simulamos asincronía con un pequeño delay
  });
}

// Endpoint usando Promesa con callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  getBooksByTitle(title)
    .then((booksFound) => {
      res.status(200).json(booksFound);
    })
    .catch((errorMessage) => {
      res.status(404).json({ message: errorMessage });
    });
});


// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   let jsonBooks = JSON.stringify(books);
//   if (!jsonBooks || jsonBooks === '{}') {
//     return res.status(404).json({ message: "No books available" });
//   }

//   let booksbytitle = [];
//   for (let isbn in books) {
//     if (books[isbn].title === req.params.title) {
//       let bookcopy = books[isbn];
//       bookcopy.isbn = isbn;
//       booksbytitle.push(bookcopy);
//     }
//   }

//   if (booksbytitle.length > 0) {
//     return res.status(200).json(booksbytitle);
//   }else{
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let jsonBooks = JSON.stringify(books);
  if (!jsonBooks || jsonBooks === '{}') {
    return res.status(404).json({ message: "No books available" });
  }

  if (books[req.params.isbn]) {
    let book = books[req.params.isbn];
    if (Object.keys(book.reviews).length > 0) {
      let datareviews = book.reviews;
      return res.status(200).json({isbn:req.params.isbn, title:book.title, reviews: datareviews});
    } else {
      return res.status(404).json({ message: "No reviews available for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});

module.exports.general = public_users;
