const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
users.push({ "username": 'Hansel', "password": 'P@ssword' });

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, "fingerprint_customer", { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({ message: "User successfully logged in" });

  } else {
    return res.status(208).json({ message: "Invalid Login." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  // Check if the book exists and the user is authenticated
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  const username = req.session.authorization.username;
  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews.push({"username":`${username}`, "review":`${review}`});
    }else{
      // Check if the user has already reviewed the book
      const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
      if (existingReviewIndex !== -1) {
        // Update the existing review
        books[isbn].reviews[existingReviewIndex].review = review;
      } else {
        // Add a new review
        books[isbn].reviews.push({"username":`${username}`, "review":`${review}`});
      }
    }
    return res.status(200).json({user: username, review: review, message: "Review added successfully" });
  } else {
    return res.status(404).json({message: "Book not found" });
  }

});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  
  // Check if the book exists and the user is authenticated
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  if (!isbn) {
    return res.status(400).json({ message: "ISBN are required" });
  }
  
  const username = req.session.authorization.username;
  if (books[isbn] && books[isbn].reviews){
    let reviewExists = books[isbn].reviews.some(review => review.username === username);
    if (reviewExists) {
      // Filter out the review by the user
      books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== username);
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }

  }else {
    return res.status(404).json({ message: "Book or review not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
