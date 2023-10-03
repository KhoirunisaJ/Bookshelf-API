const { nanoid } = require('nanoid');
const books = require('./books');

// ----------------------------------------------------------------------
// handler menyimpan buku
// eslint-disable-next-line consistent-return
const postBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Client tidak melampirkan properti name pada request body
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  books.push(newBook);
  // Bila buku berhasil dimasukkan
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

// ----------------------------------------------------------------------
// handler menampilkan buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  // Jika belum terdapat buku yang dimasukkan
  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }

  let booksfilter = books;
  // opsional: ?name
  if (name !== undefined) {
    booksfilter = books.filter((book) => {
      if (book.name) {
        return book.name.toLowerCase().includes(name.toLowerCase());
      }
      return false;
    });
  }
  // opsional: ?reading
  if (reading !== undefined) {
    const isReading = reading === '1';
    booksfilter = books.filter((book) => book.reading === isReading);
  }
  // opsional: ?finished
  if (finished !== undefined) {
    const isFinished = finished === '1';
    booksfilter = books.filter((book) => book.finished === isFinished);
  }
  const bookfilter = booksfilter.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: bookfilter,
    },
  });
  response.code(200);
  return response;
};

// ----------------------------------------------------------------------
// handler menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];
  // buku dengan id yang dilampirkan ditemukan
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  // buku dengan id yang dilampirkan oleh client tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// ----------------------------------------------------------------------
// handler mengubah data buku
const putBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  // Client tidak melampirkan properti name pada request body
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // buku berhasil diperbarui
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    // buku berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  // Id yang dilampirkan oleh client tidak ditemukkan oleh server
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// ----------------------------------------------------------------------
// handler menghapus data buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((b) => b.id === bookId);
  // id yang dilampirkan tidak dimiliki oleh buku manapun
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  // id dimiliki oleh salah satu buku
  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};
module.exports = {
  postBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  putBookByIdHandler,
  deleteBookByIdHandler,
};
