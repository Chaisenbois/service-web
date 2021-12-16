const ValidationError = require("./validationError");
const {v4: uuid} = require("uuid");

class LoanRepository {
    constructor(db, userRepository, bookRepository) {
        this.db = db
        this.userRepository = userRepository
        this.bookRepository = bookRepository
    }

    checkLoan(loan) {
        this.userRepository.get(loan?.userId);
        const books = this.bookRepository.getAll();
        if (!this._copyExist(books, loan.copyId)) {
            throw new ValidationError("This copy doesn't exist")
        }
        const loans = this.getAll().filter(l => l?.id !== loan.id)
        if (this._alreadyBorrowed(loans,loan.copyId )) {
            throw new ValidationError("This copy is already borrowed")
        }
    }

    _alreadyBorrowed(loans, copyId) {
        for (const loan of loans) {
            if (loan.copyId === copyId)  return true
        }
        return false;
    }

    _copyExist(books, copyId) {
        for (const book of books) {
            for (const copy of book.copies)  {
                if (copy.id === copyId) return true;
            }
        }
        return false;
    }

    add(loan) {
        loan.id = uuid();
        this.checkLoan(loan)
        this.db.push("/loans[]", loan);

        return loan;
    }


    get(id) {
        const loans = this.getAll();
        const loan= loans.find((l) => l?.id === id)
        if (!loan) throw new ValidationError("Loan not found")
        return loan
    }

    getAll() {
        try {
            return this.db.getData("/loans");
        } catch(err) {
            return []
        }
    }

    delete(id) {
        const path = this.getIdPath(id);
        if (path != null) {
            this.db.delete(path);
        }
    }


    update(id, loan) {
        loan = {...loan, id}
        this.checkLoan(loan)
        const path = this.getIdPath(id);
        if (path == null) {
            throw new ValidationError('This user does not exists');
        }

        this.db.push(path, loan);

        return loan;
    }

    getIdPath(id) {
        const loans = this.getAll();
        const index = loans.findIndex((u) => u?.id === id);
        if (index === -1) {
            return null;
        }

        return '/loans[' + index + ']';
    }

    getUserLoan(userId) {
        const loans = this.getAll()
        return loans.filter((l) => l.userId === userId)
    }

    getBookLoans(bookId) {
       const book = this.bookRepository.get(bookId)
       const loans = this.getAll()
        return book.copies.filter(c => !this._alreadyBorrowed(loans, c.id) )
    }
}

module.exports = LoanRepository
