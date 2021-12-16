const ValidationError = require("../../repositories/validationError");

class CopyController {
    constructor(copyRepository) {
        this.copyRepository =copyRepository
    }

    create(req, res) {
        const copy = this.copyRepository.add(req.params.bookId ,req.body);
        res.location('/books/' + req.params.bookId + '/copies/' + copy.id);
        res.status(201).send(copy);
    }

    getAll(req, res) {
        const copies = this.copyRepository.getAll(req.params.bookId);
        res.json(copies);
    }

    get(req, res) {
        const copy = this.copyRepository.get( req.params.bookId, req.params.copyId);
        if (copy == null) {
            res.status(404).send(null);
        } else {
            res.status(200).send(copy);
        }
    }

    update(req, res) {
        const copy = this.copyRepository.update(
            req.params.bookId,
            req.params.copyId, req.body)
        res.status(200).send(copy);
    }

    delete(req, res) {
        this.copyRepository.delete(req.params.bookId, req.params.copyId);
        res.status(204).send(null);
    }

}

module.exports = CopyController
