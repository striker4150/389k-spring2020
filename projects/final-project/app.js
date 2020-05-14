var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/", helpers: {
  formatMoney: function (money) { return '$' + money.toFixed(2).toLocaleString(); },
  formatArray: function (array) { return array.join(', '); }
}}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port 3000');
});
