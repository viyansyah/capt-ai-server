const { hashPassword, comparePassword } = require('../helpers/bcrypt')

describe('bcrypt helper', () => {
  it('should hash password', () => {
    const hash = hashPassword('123456')
    expect(hash).toBeDefined()
  })

  it('should return true if password match', () => {
    const hash = hashPassword('123456')
    const result = comparePassword('123456', hash)
    expect(result).toBe(true)
  })

  it('should return false if password not match', () => {
    const hash = hashPassword('123456')
    const result = comparePassword('wrong', hash)
    expect(result).toBe(false)
  })
})