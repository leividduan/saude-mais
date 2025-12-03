import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('POST /auth/signin - User Login', () => {
  const user = {
    email: `paulo.test.${Date.now()}@example.com`,
    password: 'password123',
    name: 'Paulo',
  }

  beforeAll(async () => {
    // Create a user to be used in login tests
    await request(API_URL).post('/auth/signup').send(user)
  })

  it('AUT-04: should login successfully with valid credentials', async () => {
    const response = await request(API_URL)
      .post('/auth/signin')
      .send({
        email: user.email,
        password: user.password,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('accessToken')
    expect(typeof response.body.accessToken).toBe('string')
  })

  it('AUT-05: should fail with incorrect password', async () => {
    const response = await request(API_URL)
      .post('/auth/signin')
      .send({
        email: user.email,
        password: 'wrongpassword',
      })

    expect(response.status).toBe(401)
  })

  it('AUT-06: should fail if email is not registered', async () => {
    const response = await request(API_URL)
      .post('/auth/signin')
      .send({
        email: 'unregistered.user@example.com',
        password: 'password123',
      })

    expect(response.status).toBe(401)
  })

  it('AUT-06.1: should fail if body is empty', async () => {
    const response = await request(API_URL)
      .post('/auth/signin')
      .send({})

    expect(response.status).toBe(400)
  })
})
