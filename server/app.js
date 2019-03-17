const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const { authentication } = require('./middlewares/verivy');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const tagsRouter = require('./routes/tags');

const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mini-wp-isro', {useNewUrlParser: true});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(authentication);
app.use('/articles', articlesRouter);
app.use('/tags', tagsRouter);

module.exports = app;
