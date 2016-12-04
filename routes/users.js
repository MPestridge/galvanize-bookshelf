'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const {camelizeKeys, decamelizeKeys} = require('humps');
const bcrypt = require('bcrypt-as-promised');

// eslint-disable-next-line new-cap

router.post('/users', (req, res, next) => {
  let decam = decamelizeKeys(req.body);
  bcrypt.hash(req.body.password, 12)
  .then((hashed_password) => {
    return knex('users')
    .insert({
        first_name: decam.first_name,
        last_name: decam.last_name,
        email: decam.email,
        hashed_password: hashed_password},
        '*');
  })
    .then((users) => {
      const user =users[0];
      delete user.hashed_password;
      res.set('Content-Type', 'Apllication/json');
      res.send(camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
