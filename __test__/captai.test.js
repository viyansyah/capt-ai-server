
jest.mock('../middlewares/auth', () => {
  return (req, res, next) => {
    req.user = { id: 1 }
    next()
  }
})

jest.mock('../helpers/uploadCare', () => ({
  uploadFile: jest.fn()
}))


jest.mock('../services/gemini', () => jest.fn())

const request = require('supertest')
const app = require('../app')
const { Caption } = require('../models')    


const { uploadFile } = require('../helpers/uploadCare')
const generateCaption = require('../services/gemini')

describe('POST /api/captions', () => {
    let createdCaption;

    beforeEach(async () => {
        jest.clearAllMocks()
        createdCaption = await Caption.create({
            prompt: 'test',
            tone: 'funny',
            platform: 'instagram',
            generatedText: 'Generated caption',
            imageUrl: 'https://122o2p5jkf.ucarecd.net/fake-uuid/',
            userId: 1
    })
    })
  

  it('should create caption successfully', async () => {

    
    uploadFile.mockResolvedValue({ uuid: 'fake-uuid' })
    generateCaption.mockResolvedValue('Generated caption')

    const res = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')

    console.log(res.body)

    expect(res.statusCode).toBe(201)
  })

  it('should return 400 if prompt is missing', async () => {
    const res = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('tone', 'funny')
      .field('platform', 'instagram')

    expect(res.statusCode).toBe(400)
  })

  it('should return 400 if tone is missing', async () => {
    const res = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('platform', 'instagram')

    expect(res.statusCode).toBe(400)
  })

  it('should return 400 if platform is missing', async () => {
    const res = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')

    expect(res.statusCode).toBe(400)
  })    

  it('should return 400 if image is missing', async () => {
    const res = await request(app)
      .post('/api/captions')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')

    expect(res.statusCode).toBe(400)
  })

  it('should return 500 if gemini fails', async () => {
    generateCaption.mockRejectedValue(new Error('Gemini error'))
    const res = await request(app)
      .post('/api/captions')
      .attach('image', Buffer.from('test'), 'test.jpg')
      .field('prompt', 'test')
      .field('tone', 'funny')
      .field('platform', 'instagram')

    expect(res.statusCode).toBe(500)
  })
  it('should read caption', async () => {
    const res = await request(app)
      .get('/api/captions')
     
    expect(res.statusCode).toBe(200)
  })
  it('should delete caption', async () => {
    const res = await request(app)
      .delete(`/api/captions/${createdCaption.id}`)
    expect(res.statusCode).toBe(200)
  })
  it('should update caption', async () => {
    generateCaption.mockResolvedValue('Updated caption')
    const res = await request(app)
      .put(`/api/captions/${createdCaption.id}`)
    expect(res.statusCode).toBe(200)
  })
  it('should update 404 if caption not found', async () => {
    const res = await request(app)
      .put(`/api/captions/${createdCaption.id + 1}`)
    expect(res.statusCode).toBe(404)
  })
  it('should delete 404 if caption not found', async () => {
    const res = await request(app)
      .delete(`/api/captions/${createdCaption.id + 1}`)
    expect(res.statusCode).toBe(404)
  })
  it('should read 404 if caption not found', async () => {
    const res = await request(app)
      .get(`/api/captions/${createdCaption.id + 1}`)
    expect(res.statusCode).toBe(404)
  })
  
  

  

})