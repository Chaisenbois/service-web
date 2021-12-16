const {JsonDB} = require("node-json-db");
const ValidationError = require("../validationError");
const loanRepository = require("../loanRepository")
const userRepository = require("../userRepository")
const copyRepository = require("../copyRepository")
const bookRepository = require("../bookRepository")
const fs = require("fs");

describe("loan repository", () => {
    const testData = "./data/test.json"
    const db = new JsonDB(testData, true, true);
    const bookRepo = new bookRepository(db);
    const copyRepo = new copyRepository(db, bookRepo);
    const userRepo = new userRepository(db);
    const loanRepo = new loanRepository(db, userRepo, bookRepo);
    let loan;

    const book = bookRepo.add({
        name: "Suprême",
        author: "NTM"
    })

    const copy = copyRepo.add(book.id,{
        submissionDate: "2016/12/06"
    })

    const user = userRepo.add({
        name: "Pierre",
        age: 10
    })

    afterAll(() => {
        if (fs.existsSync(testData)) fs.unlinkSync(testData);
    })

    it("should add an get loan", () => {
        loan = loanRepo.add({
            copyId: copy.id,
            userId: user.id,
            loanDate: "2020/12/06"
        })
        expect(loanRepo.getAll()).toEqual([{
            copyId: copy.id,
            userId: user.id,
            loanDate: "2020/12/06",
            id: loan.id
        }])
        expect(loanRepo.get(loan.id)).toEqual({
            copyId: copy.id,
            userId: user.id,
            loanDate: "2020/12/06",
            id: loan.id
        })
    })

    it("should update and delete loan", () => {
        loanRepo.update(loan.id, {
            copyId: copy.id,
            userId: user.id,
            loanDate: "2019/12/06"
        })
        expect(loanRepo.get(loan.id)).toEqual({
            copyId: copy.id,
            userId: user.id,
            loanDate: "2019/12/06",
            id: loan.id
        })
        loanRepo.delete(loan.id)
        expect(loanRepo.getAll()).toEqual([])
    })

    it("should alert user doesn't exist", () => {
        expect(() => loanRepo.add({
            copyId: copy.id,
            userId: "ff",
            loanDate: "2020/12/06"
        })).toThrow(ValidationError)
    })

    it("should alert copy doesn't exist", () => {
        expect(() => loanRepo.add({
            copyId: "ff",
            userId: user.id,
            loanDate: "2020/12/06"
        })).toThrow(ValidationError)
    })

    it("should alert copy already loan", () => {
        loan = loanRepo.add({
            copyId: copy.id,
            userId: user.id,
            loanDate: "2020/12/06"
        })
        expect(() => loanRepo.add({
            copyId: copy.id,
            userId: user.id,
            loanDate: "2020/12/06"
        })).toThrow(ValidationError)
    })

    it("should get loan of user", () => {
        const u2 = userRepo.add({
            name: "Philippe", age:60
        })
        const c2 = copyRepo.add(book.id, {
            submissionDate: "2017/12/06"
        })
        const l2 = loanRepo.add({
            userId: u2.id,
            copyId: c2.id,
            loanDate: "2020/12/06"
        })
        expect(loanRepo.getUserLoan(u2.id)).toEqual([{
            userId: u2.id,
            copyId: c2.id,
            loanDate: "2020/12/06",
            id: l2.id
        }])
    })

})
