const {JsonDB} = require("node-json-db");
const ValidationError = require('../validationError');
const { v4: uuid } = require('uuid');
const fs = require("fs")
const userRepository = require("../userRepository")

jest.mock('uuid');

describe("userRepository", () => {
    const testData = "./data/test.json"
    const db = new JsonDB(testData, true, true);
    const repo = new userRepository(db);

    beforeEach(() => {
        uuid.mockImplementation(() => 'testid');
    })

    afterAll(() => {
        if (fs.existsSync(testData)) fs.unlinkSync(testData);
    })


    test("should add user and delete it", () => {
        repo.add({
            name: "Pierre",
            age: 10
        })
        const allUser = repo.getAll();
        expect(allUser).toEqual([
            {
                name: "Pierre",
                age: 10,
                id: "testid"
            }
        ])
        const user = repo.get("testid")
        expect(user).toEqual({
            name: "Pierre",
            age: 10,
            id: "testid"
        })
        repo.delete(user.id)
        expect(repo.getAll()).toEqual([])
    })

    test("age is missing", () =>  {
        expect(() => repo.add({
            name: "Pierre",
        })).toThrow(ValidationError)
    })

    test("name is missing", () => {
        expect(() => repo.add({
            age: 10
        })).toThrow(ValidationError)
    })

    test("update user", () => {
        expect(() => repo.get("testid")).toThrow(ValidationError)
        repo.add({
            name: "Pierre",
            age: 10
        })
        repo.update("testid", {
            name: "Olivier",
            age: 20
        })
        const user = repo.get("testid")
        expect(user).toEqual({
            name: "Olivier",
            age: 20,
            id: "testid"
        })
    })
})
