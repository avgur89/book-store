const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// @desc    Get all authors
// @route   GET /authors
// @access  Public
router.get('/', async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect('/');
  }
});

// @desc    Get new author
// @route   GET /authors/new
// @access  Public
router.get('/new', (req, res) => {
  res.render('authors/new');
});

// @desc    Create new author
// @route   POST /authors
// @access  Public
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
    //res.redirect(`authors/${newAuthor.id}`);
    res.redirect('authors');
  } catch (error) {
    res.render('authors/new', {
      author,
      errorMessage: 'Error author creating',
    });
  }
});

module.exports = router;
