const bcrypt = require('bcryptjs')
const { comparePassword } = require('../helpers/bcrypt')
const { signToken, verifyToken } = require('../helpers/jwt')
const { uploadFile } = require('../helpers/uploadCare')
const { generateCaption } = require('../services/gemini')
process.env.JWT_SECRET = 'secret'

jest.mock('../services/gemini', () => ({
    generateCaption: jest.fn()
}))

jest.mock('../helpers/uploadCare', () => ({
    uploadFile: jest.fn()
}))

describe('Helper', () => {

    it('should compare password', async () => {
        const password = '123456'
        const hashed = await bcrypt.hash(password, 10)

        const result = await comparePassword(password, hashed)
        expect(result).toBe(true)
    })

    it('should generate token', () => {
        const token = signToken({ id: 1 })
        expect(token).toBeDefined()
    })

    it('should verify token', () => {
        const token = signToken({ id: 1 })
        const decoded = verifyToken(token)
        expect(decoded).toHaveProperty('id', 1)
    })

    it('should upload file', async () => {
        uploadFile.mockResolvedValue('https://fakeurl.com/image.jpg')

        const file = Buffer.from('test')
        const result = await uploadFile(file)

        expect(result).toBeDefined()
    })

    it('should generate caption', async () => {
        generateCaption.mockResolvedValue('Ini caption lucu')

        const caption = await generateCaption('test', 'funny', 'instagram')

        expect(caption).toBe('Ini caption lucu')
    })
})