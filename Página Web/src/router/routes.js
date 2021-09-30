const express = require('express');
const router = express.Router();
const color = require('colors');
const dotenv = require('dotenv').config();
const mysql = require('mysql2');

router.get('/historicos', (req, res) => {
    res.render("historicos");
});

router.post('/historicos', (req, res) => {
    res.render("historicos");
});


module.exports = router;