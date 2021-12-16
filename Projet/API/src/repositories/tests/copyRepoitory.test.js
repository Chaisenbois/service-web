const {JsonDB} = require("node-json-db");
const ValidationError = require('../validationError');
const { v4: uuid } = require('uuid');
const fs = require("fs")
const copyRepository = require("../copyRepository")
const bookRepository = require("../bookRepository")


describe("copyRepository", () => {
    const testData = "./data/test.json"
    const db = new JsonDB(testData, true, true);
    const bookRepo = new bookRepository(db);
    const copyRepo = new copyRepository(db, bookRepo);

    afterAll(() => {
        if (fs.existsSync(testData)) fs.unlinkSync(testData);
    })


    test("should add copy and delete it", () => {
        const book = bookRepo.add({
            name: "Harry Potter à l'école des sorciers",
            author: "J.K Rowling"
        })
        const copy = copyRepo.add(book.id, {
            submissionDate:  "2016/12/06",
        })
        const allCopies = copyRepo.getAll(book.id);
        expect(allCopies).toEqual([
            {
                submissionDate:  "2016/12/06",
                id: copy.id
            }
        ])
        expect(copyRepo.get(book.id, copy.id)).toEqual({
            submissionDate:  "2016/12/06",
            id: copy.id
        })
        copyRepo.delete(book.id, copy.id)
        expect(() => copyRepo.get(book.id, copy.id)).toThrow(ValidationError)
        expect(copyRepo.getAll(book.id)).toEqual([])
    })

    it("should update a copy", () => {
        const book = bookRepo.add({
            name: "Harry Potter à l'école des sorciers",
            author: "J.K Rowling"
        })
        const copy = copyRepo.add(book.id, {
            submissionDate:  "2016/12/06",
        })
        copyRepo.update(book.id, copy.id, {
            submissionDate:  "2020/12/06",
        })
        expect(copyRepo.get(book.id, copy.id)).toEqual({
            submissionDate:  "2020/12/06",
            id: copy.id
        })
    })
})
