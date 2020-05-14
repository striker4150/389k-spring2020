var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morganLogger = require('morgan');

var Logger = require('./utils/logging');
var openConnection = require('./utils/db').openConnection;

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/", helpers: {
  formatMoney: function (money) { return '$' + money.toFixed(2).toLocaleString(); },
  formatArray: function (array) { return array.join(', '); }
}}));
app.set('view engine', 'handlebars');

app.use(morganLogger('combined', { 'stream': Logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.use('/', indexRouter);
app.use('/api', apiRouter);

openConnection().then(() => {
  app.listen(process.env.PORT || 3000, function () {
    Logger.info('Listening on port 3000');
  });
});
