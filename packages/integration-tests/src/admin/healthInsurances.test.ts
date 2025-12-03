import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { getAuthToken } from '../helpers.js'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('Admin Module - Health Insurance Management', () => {
  let adminToken: string
  let patientToken: string

  beforeAll(async () => {
    adminToken = await getAuthToken('admin')
    patientToken = await getAuthToken('patient1')
  })

  it('ADM-10: should create a new health insurance successfully', async () => {
    const response = await request(API_URL)
      .post('/admin/health-insurances')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Insurance-${Date.now()}` })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('ADM-11: should fail to create a health insurance with a duplicate name', async () => {
    const insuranceName = `Unique-Insurance-${Date.now()}`

    // Create it once
    await request(API_URL)
      .post('/admin/health-insurances')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: insuranceName })

    // Try to create it again
    const response = await request(API_URL)
      .post('/admin/health-insurances')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: insuranceName })

    expect(response.status).toBe(409)
  })

  it('ADM-12: should forbid access to non-admin users', async () => {
    const response = await request(API_URL)
      .delete(`/admin/health-insurances/${randomUUID()}`)
      .set('Authorization', `Bearer ${patientToken}`);

    expect(response.status).toBe(403);
  });

  it('ADM-12.1: should fail to delete a non-existent health insurance', async () => {
    const response = await request(API_URL)
      .delete(`/admin/health-insurances/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(404)
  })
})
