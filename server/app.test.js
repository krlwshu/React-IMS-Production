const request = require("supertest");
const app = require("./server");

describe("POST /login", function () {

    it('UT001.001 - Null user and password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: '',
                password: '',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.error).toEqual("Auth failure")

    })
    it('UT001.002 - Null user, valid password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: '',
                password: 'Karl1234',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.error).toEqual("Auth failure")

    })
    it('UT001.003 - Valid user, null password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'karl.webster@outlook.com',
                password: '',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.error).toEqual("Auth failure")

    })
    it('UT001.004 - Deactivated user, valid password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'deactivated.user',
                password: 'Test1234',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.error).toEqual("Auth failure")

    })

    it('UT001.005 - Valid user & password - happy days!', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'karl.webster@test.com',
                password: 'Test234',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("token")
        expect(res.body.token).toEqual(expect.any(String))
    })

});