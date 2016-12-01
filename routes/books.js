'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const {camelizeKeys, decamelizeKeys} = require('humps');
// const boom = require('boom');

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.set('Accept', 'application/json');
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((book) => {
    if (!book) {
      return next();
    }
    res.send(camelizeKeys(book));
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/books', (req, res, next) => {
  let decam = decamelizeKeys(req.body);
  let bookObj = {
    title: decam.title,
    author: decam.author,
    genre: decam.genre,
    description: decam.description,
    cover_url: decam.cover_url
  };
  knex('books')
   .insert(bookObj, '*')
   .then((newBook) => {
     res.set('Content-Type', 'Application/json');
     res.send(camelizeKeys(newBook[0]));
   })
   .catch((err) => {
     next(err);
   });
});

router.patch('/books/:id', (req, res, next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((book) => {
    if(!book) {
      return next();
    }
    let decam = decamelizeKeys(req.body);
    let bookObj = {
      title: decam.title,
      author: decam.author,
      genre: decam.genre,
      description: decam.description,
      cover_url: decam.cover_url
    };
    return knex('books')
    .update(bookObj, '*')
    .where('id', req.params.id);
  })
  .then((book) => {
    res.send(camelizeKeys(book[0]));
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/books/:id', (req, res, next) => {
  let book;

  knex('books')
  .where('id', req.params.id)
  .first()
  .then((row) => {
    if(!row) {
      return next;
    }

    book = camelizeKeys(row);

    return knex('books')
    .del()
    .where('id', req.params.id);
  })
  .then(() => {
    delete book.id;
    res.send(book);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
