import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'
import { getAuthToken } from '../helpers.js'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('Admin Module - Doctor Management', () => {
  let adminToken: string
  let doctorToken: string
  let newUserId: string

  beforeAll(async () => {
    adminToken = await getAuthToken('admin')
    doctorToken = await getAuthToken('doctor')
  })

  beforeEach(async () => {
    // Create a new user to be promoted to doctor in tests
    const newUserRes = await request(API_URL).post('/auth/signup').send({
      name: 'Future Doctor',
      email: `future.doc.${Date.now()}@example.com`,
      password: 'password123',
    })
    newUserId = newUserRes.body.id

    // Clean up doctors created during tests
    await db.doctor.deleteMany({ where: { user: { email: { contains: 'future.doc' } } } })
  })

  it('ADM-07: should create a new doctor profile successfully', async () => {
    const response = await request(API_URL)
      .post('/admin/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: newUserId,
        crm: `CRM-NEW-${Date.now()}`,
        specialty: 'Pediatrics',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('ADM-08: should fail to create a doctor with a duplicate CRM', async () => {
    const uniqueCrm = `CRM-UNIQUE-${Date.now()}`

    // Create first doctor
    await request(API_URL)
      .post('/admin/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: newUserId,
        crm: uniqueCrm,
        specialty: 'Dermatology',
      })

    // Create another user to try to assign the same CRM
    const anotherUserRes = await request(API_URL).post('/auth/signup').send({
      name: 'Another Future Doctor',
      email: `another.doc.${Date.now()}@example.com`,
      password: 'password123',
    });

    const response = await request(API_URL)
      .post('/admin/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: anotherUserRes.body.id,
        crm: uniqueCrm, // Same CRM
        specialty: 'General Practice',
      })

    expect(response.status).toBe(409)
  })

  it('ADM-08.1: should fail if userId does not exist', async () => {
    const response = await request(API_URL)
      .post('/admin/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: randomUUID(), // Non-existent user
        crm: `CRM-FAIL-${Date.now()}`,
        specialty: 'Neurology',
      })

    expect(response.status).toBe(404)
  })

  it('ADM-08.1: should fail if user is already a doctor', async () => {
    // Make the user a doctor first
    await request(API_URL)
      .post('/admin/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: newUserId,
        crm: `CRM-DUPE-USER-${Date.now()}`,
        specialty: 'Oncology',
      })

    // Attempt to create another doctor profile for the same user
    const response = await request(API_URL)
      .post('/admin/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: newUserId,
        crm: `CRM-DUPE-USER-2-${Date.now()}`,
        specialty: 'Radiology',
      })

    expect(response.status).toBe(409)
  });

  it('ADM-09: should forbid access to non-admin users', async () => {
    const response = await request(API_URL)
      .get('/admin/doctors')
      .set('Authorization', `Bearer ${doctorToken}`) // Using another doctor's token

    expect(response.status).toBe(403)
  })

  it('ADM-09.1: should fail to delete a non-existent doctor', async () => {
    const response = await request(API_URL)
      .delete(`/admin/doctors/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(404)
  });
})
