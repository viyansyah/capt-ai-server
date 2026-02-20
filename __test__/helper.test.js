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
    it('should return false if password is wrong', async () => {
        const password = '123456'
        const hashed = await bcrypt.hash(password, 10)

        const result = await comparePassword('123', hashed)
        expect(result).toBe(false)
    })
    it('should throw error if token is invalid', () => {
        const token = 'invalid'
        expect(() => verifyToken(token)).toThrow()
    })
    it('should return null when signToken fails', () => {
        const jwtHelper = require('../helpers/jwt')
        jest.spyOn(jwtHelper, 'signToken').mockReturnValueOnce(null)

        const token = jwtHelper.signToken({ id: 1 })
        expect(token).toBeNull()
    })
    it('should throw error if hashed password undefined', () => {
        const { comparePassword } = require('../helpers/bcrypt')

        expect(() => comparePassword('123', undefined)).toThrow()
    })
    it('should throw error if password undefined', () => {
        expect(() => comparePassword(undefined, 'hash')).toThrow()
    })
    it('should throw error if both arguments undefined', () => {
        expect(() => comparePassword(undefined, undefined)).toThrow()
    })
    it('should return null when verifyToken fails', () => {
        const jwtHelper = require('../helpers/jwt')
        jest.spyOn(jwtHelper, 'verifyToken').mockReturnValueOnce(null)

        const decoded = jwtHelper.verifyToken('invalid')
        expect(decoded).toBeNull()
    })
    it('should return null when uploadFile fails', async () => {
        const uploadCareHelper = require('../helpers/uploadCare')
        jest.spyOn(uploadCareHelper, 'uploadFile').mockReturnValueOnce(null)

        const file = Buffer.from('test')
        const result = await uploadCareHelper.uploadFile(file)
        expect(result).toBeNull()
    })
    it('should return null when generateCaption fails', async () => {
        const geminiService = require('../services/gemini')
        jest.spyOn(geminiService, 'generateCaption').mockReturnValueOnce(null)

        const caption = await geminiService.generateCaption('test', 'funny', 'instagram')
        expect(caption).toBeNull()
    })

})