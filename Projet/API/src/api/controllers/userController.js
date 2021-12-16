
class UserController {
    constructor(userRepository, loanRepository) {
        this.userRepository = userRepository
        this.loanRepository = loanRepository
    }

    create(req, res) {
        const user = this.userRepository.add(req.body);
        res.location('/users/' + user.id);
        res.status(201).send(user);
    }

    getAll(req, res) {
        const users = this.userRepository.getAll();
        res.json(users);
    }

    get(req, res) {
        const user = this.userRepository.get(req.params.userId);
        if (user == null) {
            res.status(404).send(null);
        } else {
            res.status(200).send(user);
        }
    }

    update(req, res) {
        const user = this.userRepository.update(req.params.userId, req.body)
        res.status(200).send(user);
    }

    delete(req, res) {
        this.userRepository.delete(req.params.userId);
        res.status(204).send(null);
    }

    getLoans(req, res) {
        const loans = this.loanRepository.getUserLoan(req.params.userId)
        res.status(200).send(loans)
    }

}

module.exports = UserController
