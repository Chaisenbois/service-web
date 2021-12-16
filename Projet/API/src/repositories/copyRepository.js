const {v4: uuid} = require("uuid");
const ValidationError = require('./validationError');
const _ = require("lodash");

class CopyRepository {
    constructor(db, bookRepository) {
        this.db = db;
        this.bookRepository = bookRepository;
    }

    getAll(bookId) {
        const bookPath = this.bookRepository.getIdPath(bookId);
        if (bookPath == null) {
            throw new ValidationError('This book does not exists')
        }

        return this.db.getData(bookPath + '/copies');
    }

    get(bookId, copyId) {
        const book = this.bookRepository.get(bookId)
        const copy =  book?.copies.find(c => c.id === copyId);
        if (!copy) throw new ValidationError("This copy doesn't exist");
        return copy
    }


    delete(bookId, copyId) {
        const path = this.getIdPath(bookId, copyId);
        if (path != null) {
            this.db.delete(path);
        }
    }


    add(bookId, copy) {
        copy.id = uuid();
        const books = this.bookRepository.getAll()
        const bookIndex = books.findIndex(b => b.id === bookId)
        this.db.push(`/books[${bookIndex}]/copies[]`, copy);

        return copy;
    }

    getIdPath(bookId, id) {
        const copies = this.getAll(bookId);
        const index = _.findIndex(copies, { id });
        if (index === -1) {
            return null;
        }

        const bookPath = this.bookRepository.getIdPath(bookId);
        return bookPath +'/copies[' + index + ']';
    }

    update(bookId, copyId, copy) {
        const path = this.getIdPath(bookId, copyId);
        if (path == null) {
            throw new ValidationError('This copy does not exists');
        }
        copy.id = copyId;
        this.db.push(path, copy);

        return copy;
    }
}

module.exports = CopyRepository;
