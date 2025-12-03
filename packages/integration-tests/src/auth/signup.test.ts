import { describe, it, expect } from 'vitest'
import request from 'supertest'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('POST /auth/signup - User Registration', () => {
  it('AUT-01: should create a new user successfully', async () => {
    const uniqueEmail = `test.user.${Date.now()}@example.com`
    
    const response = await request(API_URL)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(typeof response.body.id).toBe('string')
  })

  it('AUT-02: should fail if email is already registered', async () => {
    const sharedEmail = `shared.user.${Date.now()}@example.com`
    
    // First request to create the user
    await request(API_URL)
      .post('/auth/signup')
      .send({
        name: 'Initial User',
        email: sharedEmail,
        password: 'password123',
      })

    // Second request with the same email
    const response = await request(API_URL)
      .post('/auth/signup')
      .send({
        name: 'Another User',
        email: sharedEmail,
        password: 'password456',
      })

    expect(response.status).toBe(409) // Or 400, depending on API implementation
  })

  it('AUT-03: should fail if password is less than 8 characters', async () => {
    const response = await request(API_URL)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: `test.${Date.now()}@example.com`,
        password: '123',
      })

    expect(response.status).toBe(400)
  })

  it('AUT-03.1: should fail if email format is invalid', async () => {
    const response = await request(API_URL)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      })

    expect(response.status).toBe(400)
  })

  it('AUT-03.2: should fail if body is empty', async () => {
    const response = await request(API_URL)
      .post('/auth/signup')
      .send({})

    expect(response.status).toBe(400)
  })
})
