const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// @desc    Get all books
// @route   GET /books
// @access  Public
router.get('/', async (req, res) => {
  let query = Book.find();

  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }

  try {
    const books = await query.exec();

    res.render('books/index', {
      books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect('/');
  }
});

// @desc    Get new book
// @route   GET /books/new
// @access  Public
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

// @desc    Create new book
// @route   POST /books
// @access  Public
router.post('/', async (req, res) => {
  const { title, author, publishDate, pageCount, description } = req.body;

  const book = new Book({
    title,
    author,
    publishDate: new Date(publishDate),
    pageCount,
    description,
  });

  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect('/books');
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = { authors, book };

    if (hasError) {
      params.errorMessage = 'Error creating book';
    }

    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books');
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);

  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

module.exports = router;
