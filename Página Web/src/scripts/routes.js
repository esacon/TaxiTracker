import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

export const routes = router;