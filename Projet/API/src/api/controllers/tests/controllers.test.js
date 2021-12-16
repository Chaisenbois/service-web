const request = require('supertest');
const run = require("../../../server");
const {v4: uuid} = require("uuid");
const fs = require("fs");
const {JsonDB} = require("node-json-db");

const testData = "./data/test_controller.json"
const db = new JsonDB(testData, true, true);
const server = run(db)

afterAll(() => {
    if (fs.existsSync(testData)) fs.unlinkSync(testData);
})
describe("user endpoints", () => {
    let id;

    it("get and add user endpoint", async () => {
        let res = await request(server).post("/users").send({
            name: "Harry potter",
            age: 10
        })
        id = res.body.id
        expect(res.headers.location).toEqual(`/users/${id}`);
        expect(res.status).toBe(201)
        expect(res.body).toEqual({
            name: "Harry potter",
            age: 10,
            id
        })
        res = await request(server).get(`/users/${id}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
            name: "Harry potter",
            age: 10,
            id
        })
        res = await request(server).get("/users")
        expect(res.status).toBe(200)
        expect(res.body).toEqual([{
            name: "Harry potter",
            age: 10,
            id
        }])
    })

    it("update and delete endpoint", async () => {
        res = await request(server).put(`/users/${id}`).send({
            name: "Harry",
            age: 20
        })
        res = await request(server).get(`/users/${id}`)
        expect(res.body).toEqual({
            name: "Harry",
            age: 20,
            id
        })
        res = await request(server).delete(`/users/${id}`)
        expect(res.status).toEqual(204)
        res = await request(server).get("/users")
        expect(res.body).toEqual([])
    })
})

describe("copy endpoints", () => {

    let bookId;
    let copyId;
    it("add and get endpoints", async () => {
        let res = await request(server).post("/books").send({
            name: "Harry Potter",
            author: "J.K Rowling"
        })
        bookId = res.body.id
        res = await request(server).post(`/books/${bookId}/copies`).send({
            submissionDate:  "2016/12/06",
        })
        copyId = res.body.id
        expect(res.headers.location).toEqual(`/books/${bookId}/copies/${copyId}`);
        expect(res.status).toBe(201)
        expect(res.body).toEqual({
            submissionDate:  "2016/12/06",
            id: copyId
        })
        res = await request(server).get(`/books/${bookId}/copies/${copyId}`)
        expect(res.body).toEqual({
            submissionDate:  "2016/12/06",
            id: copyId
        })
        res = await request(server).get(`/books/${bookId}/copies`)
        expect(res.body).toEqual([{
            submissionDate:  "2016/12/06",
            id: copyId
        }])
    })

    it("should update and delete a copy", async () => {
        let res = await request(server).put(`/books/${bookId}/copies/${copyId}`).send({
            submissionDate:  "2001/12/06",
        });
        expect(res.status).toEqual(200)
        expect(res.body).toEqual({
            submissionDate:  "2001/12/06",
            id: copyId
        })
        res = await request(server).get(`/books/${bookId}/copies/${copyId}`)
        expect(res.body).toEqual({
            submissionDate:  "2001/12/06",
            id: copyId
        })
        res = await request(server).delete(`/books/${bookId}/copies/${copyId}`)
        expect(res.status).toEqual(204)
        res = await request(server).get(`/books/${bookId}/copies`)
        expect(res.body).toEqual([]);
    })
})

describe("loan endpoints", () => {
    let user, book, copy, loanId;
    beforeAll(async () => {
         let res= await request(server).post("/users").send({
            name: "Pierre",
            age: 10
        })
        user = res.body
        res = await request(server).post("/books").send({
            name: "Harry Potter",
            author: "J.K Rowling"
        })
        book = res.body
        res = await request(server).post(`/books/${book.id}/copies`).send({
            submissionDate:  "2016/12/06",
        })
        copy = res.body
    })

    it("add and get endpoint", async () => {
        let res = await request(server).post("/loans").send({
           copyId: copy.id,
           userId: user.id,
           loadDate: "2019/12/06",
        })
        loanId = res.body.id
        expect(res.status).toEqual(201)
        expect(res.headers.location).toEqual(`/loans/${loanId}`)
        res = await request(server).get("/loans")
        expect(res.status).toEqual(200)
        expect(res.body).toEqual([{
            copyId: copy.id,
            userId: user.id,
            loadDate: "2019/12/06",
            id: loanId
        }])
        res = await request(server).get(`/loans/${loanId}`)
        expect(res.status).toEqual(200)
        expect(res.body).toEqual({
            copyId: copy.id,
            userId: user.id,
            loadDate: "2019/12/06",
            id: loanId
        })
    })

    it("put and delete endpoint", async() => {
        let res = await request(server).put(`/loans/${loanId}`).send({
            copyId: copy.id,
            userId: user.id,
            loadDate: "2017/12/06",
        })
        res = await request(server).get(`/loans/${loanId}`)
        expect(res.body).toEqual({
            copyId: copy.id,
            userId: user.id,
            loadDate: "2017/12/06",
            id: loanId
        })
        res = await request(server).delete(`/loans/${loanId}`)
        expect(res.status).toEqual(204)
        res = await request(server).get('/loans')
        expect(res.body).toEqual([])
    })

    it("user's loan endpoint", async () => {
        let res = await request(server).post("/loans").send({
            copyId: copy.id,
            userId: user.id,
            loadDate: "2019/12/06",
        })
        const lId = res.body.id
        res = await request(server).get(`/users/${user.id}/loans`)
        expect(res.status).toEqual(200)
        expect(res.body).toEqual([ {
                copyId: copy.id,
                userId: user.id,
                loadDate: "2019/12/06",
                id: lId
            }])
    })

    it("book's loans endpiont", async () => {
        let res = await request(server).post(`/books/${book.id}/copies`).send({
            submissionDate:  "2016/12/06",
        })
        const copyId = res.body.id
        res = await request(server).post(`/books/${book.id}/copies`).send({
            submissionDate:  "2015/12/06",
        })
        res = await request(server).post("/loans").send({
            copyId: res.body.id,
            userId: user.id,
            loadDate: "2019/12/06",
        })
        res = await request(server).get(`/books/${book.id}/availableCopies`)
        expect(res.status).toEqual(200)
        expect(res.body).toEqual([{
            submissionDate:  "2016/12/06",
            id: copyId
        }])
    })
})
