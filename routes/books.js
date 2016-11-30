'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const {camelizeKeys, decamelizeKeys} = require('humps');

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('books/:id', (req, res, next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((books) => {
    if (!books) {
      return next();
    }
    res.send(camelizeKeys(books));
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
