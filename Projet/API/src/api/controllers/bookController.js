class BookController {
    constructor(bookRepository, loanRepository) {
        this.bookRepository = bookRepository;
        this.loanRepository = loanRepository
    }

    getAll(req, res) {
        const books = this.bookRepository.getAll();
        res.json(books);
    }

    create(req, res) {
        const book = this.bookRepository.add(req.body);
        res.location('/books/' + book.id);
        res.status(201).send(book);
    }
    
    get(req, res) {
        const book = this.bookRepository.get(req.params.bookId);
        if (book == null) {
            res.status(404).send(null);
        } else {
            res.status(200).send(book);
        }
    }
    
    update(req, res) {
        const book = this.bookRepository.update(req.params.bookId, req.body)
        res.status(200).send(book);
    }
    
    delete(req, res) {
        this.bookRepository.delete(req.params.bookId);
        res.status(204).send(null);
    }

    getLoans(req, res ) {
        const loans = this.loanRepository.getBookLoans(req.params.bookId)
        res.status(200).send(loans)
    }
}

module.exports = BookController;
