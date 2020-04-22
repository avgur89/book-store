const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

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
    res.redirect(`authors/${newAuthor.id}`);
  } catch (error) {
    res.render('authors/new', {
      author,
      errorMessage: 'Error author creating',
    });
  }
});

// @desc    Get single author
// @route   GET /authors/id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();

    res.render('authors/single', {
      author,
      booksByAuthor: books,
    });
  } catch (error) {
    res.redirect('/');
  }
});

// @desc    Get edit author page
// @route   GET /authors/id/edit
// @access  Public
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    res.render('authors/edit', { author });
  } catch (error) {
    res.redirect('/authors');
  }
});

// @desc    Update author
// @route   PUT /authors/id
// @access  Public
router.put('/:id', async (req, res) => {
  let author;

  try {
    author = Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.render('authors/edit', {
        author,
        errorMessage: 'Error updating Author',
      });
    }
  }
});

// @desc    Delete author
// @route   DELETE /authors/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  let author;

  try {
    author = Author.findById(req.params.id);
    await author.remove();
    res.redirect('/authors');
  } catch (error) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
