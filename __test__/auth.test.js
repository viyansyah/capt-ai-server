
process.env.JWT_SECRET = 'secret'

jest.mock('../helpers/jwt', () => ({
  signToken: jest.fn(),
  verifyToken: jest.fn()
}))

jest.mock('../services/gemini', () => ({
  generateCaption: jest.fn()
}))

const request = require('supertest')
const app = require('../app')
const { User } = require('../models')
const { generateCaption } = require('../services/gemini')
const { signToken, verifyToken } = require('../helpers/jwt')

let access_token;
describe('Auth', () => {
   beforeAll(async () => {
    signToken.mockReset()
    verifyToken.mockReset()
    verifyToken.mockReturnValue({ id: 1 })
    signToken.mockReturnValue('dummy_token')
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
 
  it('should return 401 if token is expired', async () => {
    const jwt = require('jsonwebtoken')
    const expiredToken = jwt.sign({ id: 1 }, 'secret', { expiresIn: '1s' })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const response = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')
      .set('Authorization', `Bearer ${expiredToken}`)
    expect(response.status).toBe(500)
  })
  it('should return 401 if token is missing', async () => {
    const response = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')
    expect(response.status).toBe(401)
  })
  it('should return 401 if token is not provided', async () => {
    const response = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')
    expect(response.status).toBe(401)
  })
  it('should return 401 header authorization not Bearer', async () => {
    const response = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')   
      .field('platform', 'instagram')
      .set('Authorization', access_token)
    expect(response.status).toBe(401)
  })
  it('should return  if user from token not found', async () => {
    await User.destroy({ where: { email: 'test1@gmail.com' } })
    const response = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')
      .set('Authorization', `Bearer ${access_token}`)
    expect(response.status).toBe(500)
  })
  it('should return email missing', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        password: '123456'
      })
    expect(response.status).toBe(400)
  })
  it('should return password missing', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test1@gmail.com'
      })
    expect(response.status).toBe(400)
  })
  it('should return 400 if email is invalid', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test1gmail.com',
        password: '123456'
      })
    expect(response.status).toBe(400)
  })
  it('should return 400 email and password missing', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({})
    expect(response.status).toBe(400)
  })
  it('should return 400 if email missing', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        password: '123456'
      })
    expect(response.status).toBe(400)
  })
  it('should return 400 if password missing', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test1@gmail.com'
      })
    expect(response.status).toBe(400)
  })
  it('should return 400 if token generation fails', async () => {
    await User.create({
        email: 'test1@gmail.com',
        password: '123456'
    })

    signToken.mockReturnValueOnce(null)

    const response = await request(app)
        .post('/api/users/login')
        .send({
        email: 'test1@gmail.com',
        password: '123456'
        })

    expect(response.status).toBe(400)
    })
    it('should return 401 if bearer without token', async () => {
        const response=await request(app)
        .post('/api/captions')
        .attach('image', Buffer.from('test'), 'test.jpg')
        .field('prompt', 'test')
        .field('tone', 'funny')
        .field('platform', 'instagram')
        .set('Authorization', `Bearer `)
        expect(response.status).toBe(401)
    })
    it('should return 401 if authozation format invalid', async () => {
        const response=await request(app)
        .post('/api/captions')
        .attach('image', Buffer.from('test'), 'test.jpg')
        .field('prompt', 'test')
        .field('tone', 'funny')
        .field('platform', 'instagram')
        .set('Authorization', `Bearer ${access_token}123`)
        expect(response.status).toBe(500)
    })
    it('should return 401 if authorization has no space', async () => {
    const res = await request(app)
        .post('/api/captions')
        .set('Authorization', 'BearerToken123')
        .attach('image', Buffer.from('test'), 'test.jpg')
        .field('prompt', 'test')
        .field('tone', 'funny')
        .field('platform', 'instagram')

    expect(res.status).toBe(401)
    })
    it('should return 401 if authorization has no space', async () => {
  const res = await request(app)
    .post('/api/captions')
    .set('Authorization', 'Bearer')
    .attach('image', Buffer.from('test'), 'test.jpg')
    .field('prompt', 'test')
    .field('tone', 'funny')
    .field('platform', 'instagram')

  expect(res.status).toBe(401)
})
it('should return 401 if authorization format invalid', async () => {
  const res = await request(app)
    .post('/api/captions')
    .set('Authorization', 'Basic dummy_token')
    .attach('image', Buffer.from('test'), 'test.jpg')
    .field('prompt', 'test')
    .field('tone', 'funny')
    .field('platform', 'instagram')

  expect(res.status).toBe(500)
})
it('should return 401 if verifyToken throws error', async () => {
  const jwtHelper = require('../helpers/jwt')
  jest.spyOn(jwtHelper, 'verifyToken').mockImplementationOnce(() => {
    throw new Error('Invalid')
  })

  const res = await request(app)
    .post('/api/captions')
    .set('Authorization', 'Bearer dummy_token')
    .attach('image', Buffer.from('test'), 'test.jpg')
    .field('prompt', 'test')
    .field('tone', 'funny')
    .field('platform', 'instagram')

  expect(res.status).toBe(500)
})
    

  
  
})