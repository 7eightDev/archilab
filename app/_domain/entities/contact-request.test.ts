import { ContactRequestSchema } from './contact-request'

const validRequest = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

describe('ContactRequestSchema', () => {
  it('accepts a valid request', () => {
    expect(ContactRequestSchema.parse(validRequest)).toEqual(validRequest)
  })

  it('keeps the optional phone when provided', () => {
    expect(ContactRequestSchema.parse({ ...validRequest, phone: '+39 081 1234567' }).phone).toBe(
      '+39 081 1234567',
    )
  })

  it('trims text fields', () => {
    const request = ContactRequestSchema.parse({
      ...validRequest,
      name: '  Mario Bianchi  ',
      email: ' mario@example.com ',
      message: `  ${validRequest.message}  `,
    })

    expect(request.name).toBe('Mario Bianchi')
    expect(request.email).toBe('mario@example.com')
    expect(request.message).toBe(validRequest.message)
  })

  it('rejects a blank name', () => {
    expect(ContactRequestSchema.safeParse({ ...validRequest, name: '   ' }).success).toBe(false)
  })

  it('rejects a name longer than 100 characters', () => {
    expect(ContactRequestSchema.safeParse({ ...validRequest, name: 'a'.repeat(101) }).success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(ContactRequestSchema.safeParse({ ...validRequest, email: 'mario@' }).success).toBe(false)
  })

  it('rejects a message shorter than 10 characters', () => {
    expect(ContactRequestSchema.safeParse({ ...validRequest, message: 'Ciao' }).success).toBe(false)
  })

  it('rejects a message longer than 2000 characters', () => {
    expect(ContactRequestSchema.safeParse({ ...validRequest, message: 'a'.repeat(2001) }).success).toBe(
      false,
    )
  })

  it('requires privacy consent', () => {
    expect(ContactRequestSchema.safeParse({ ...validRequest, privacyConsent: false }).success).toBe(false)
  })
})
