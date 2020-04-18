const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Environment constants
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Template engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('layout', 'layouts/layout');

// Middlewares
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);
app.use('/authors', authorsRouter);

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${NODE_ENV} mode on port ${PORT}`.yellow.underline
      .bold
  )
);

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
