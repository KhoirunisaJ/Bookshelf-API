const {
  postBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  putBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

// routes menyimpan buku
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postBookHandler,
  },
  // routes menampilkan buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  // routes menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  // routes mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: putBookByIdHandler,
  },
  // routes menghapus data buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
