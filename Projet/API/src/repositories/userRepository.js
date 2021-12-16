const {v4: uuid} = require("uuid");
const ValidationError = require("./validationError");
const _ = require("lodash");


class UserRepository {
    constructor(db) {
        this.db = db
    }

    checkUser(user) {
        if (!user.age) {
            throw new ValidationError('The user must have an age.');
        }
        if (!user.name) {
            throw new ValidationError('The user must have have a name.');
        }
    }

    add(user) {
        user.id = uuid();
        this.checkUser(user)
        this.db.push("/users[]", user);

        return user;
    }


    get(id) {
        const users = this.getAll();
        const user= users.find((user) => user?.id === id)
        if (!user) throw new ValidationError("User not found")
        return user
    }

    getAll() {
        try {
            return this.db.getData("/users");
        } catch(err) {
            this.db.push("/users[]")
            return []
        }
    }

    delete(id) {
        const path = this.getIdPath(id);
        if (path != null) {
            this.db.delete(path);
        }
    }


    update(id, user) {
        this.checkUser(user)
        const path = this.getIdPath(id);
        user.id = id
        if (path == null) {
            throw new ValidationError('This user does not exists');
        }

        this.db.push(path, user);

        return user;
    }

    getIdPath(id) {
        const users = this.getAll();
        const index = users.findIndex((u) => u?.id === id);
        if (index === -1) {
            return null;
        }

        return '/users[' + index + ']';
    }

}


module.exports = UserRepository
