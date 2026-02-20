process.env.JWT_SECRET = 'secret'
jest.mock('../services/gemini', () => ({
  generateCaption: jest.fn()
}))
const request = require('supertest')
const app = require('../app')
const { User } = require('../models')
const { generateCaption } = require('../services/gemini')

let access_token;
describe('Auth', () => {
   beforeAll(async () => {
    generateCaption.mockResolvedValue('Caption Test')
        await User.destroy({ where: { email: 'test1@gmail.com' } })
        
    })
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test1@gmail.com',
                password: '123456'
            })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('email')
    })
    it('should return 400 if email is already registered', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test1@gmail.com',
                password: '123456'
            })
        expect(response.status).toBe(400)
    })
    it('should return 400 if password is too short', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test2@gmail.com',
                password: '123'
            })
        expect(response.status).toBe(400)
    })
    it('should return 400 if email is invalid', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test2',
                password: '123456'
            })
        expect(response.status).toBe(400)
    })  

    it('should login a user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email:'test1@gmail.com',
                password: '123456'
            })
        access_token=response.body.access_token
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('access_token')
    })
    it('should return 401 if user is not authenticated', async () => {
    const res = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')

    expect(res.statusCode).toBe(401)
  })
  it('should return 401 if email not found', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test3@gmail.com',
        password: '123456'
      })
    expect(response.status).toBe(404)
  })
  it('should return 404 if password is wrong', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test1@gmail.com',
        password: '123'
      })
    expect(response.status).toBe(401)
  })
  
  
})