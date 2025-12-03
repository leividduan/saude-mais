import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { getAuthToken } from '../helpers.js'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('Admin Module - Reports', () => {
  let adminToken: string
  let doctorToken: string
  let healthInsuranceId: string

  beforeAll(async () => {
    adminToken = await getAuthToken('admin')
    doctorToken = await getAuthToken('doctor')

    // Create a health insurance for the report tests
    const res = await request(API_URL)
      .post('/admin/health-insurances')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Report-Insurance-${Date.now()}` })
    healthInsuranceId = res.body.id
  })

  describe('GET /admin/reports/appointments-by-insurance', () => {
    it('ADM-13: should generate a PDF report successfully', async () => {
      const response = await request(API_URL)
        .get('/admin/reports/appointments-by-insurance')
        .query({ healthInsuranceId })
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toBe('application/pdf')
    })

    it('ADM-14: should fail if healthInsuranceId is not provided', async () => {
      const response = await request(API_URL)
        .get('/admin/reports/appointments-by-insurance')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
    })

    it('ADM-15: should forbid access to non-admin users', async () => {
      const response = await request(API_URL)
        .get('/admin/reports/appointments-by-insurance')
        .query({ healthInsuranceId })
        .set('Authorization', `Bearer ${doctorToken}`)

      expect(response.status).toBe(403)
    })

    it('ADM-15.1: should fail with an invalid date format for startDate', async () => {
      const response = await request(API_URL)
        .get('/admin/reports/appointments-by-insurance')
        .query({ healthInsuranceId, startDate: '2025-13-01' }) // Invalid month
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
    })

    it('ADM-15.2: should fail if health insurance does not exist', async () => {
      const response = await request(API_URL)
        .get('/admin/reports/appointments-by-insurance')
        .query({ healthInsuranceId: randomUUID() }) // Non-existent ID
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
    })
  })
})
