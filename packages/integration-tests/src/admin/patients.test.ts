import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'
import { getAuthToken, SEEDED_USERS } from '../helpers.js'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('Admin Module - Patient Management', () => {
  let adminToken: string
  let patientToken: string
  let healthInsuranceId: string

  beforeAll(async () => {
    adminToken = await getAuthToken('admin')
    patientToken = await getAuthToken('patient1')

    // Create a health insurance for tests
    const insuranceResponse = await request(API_URL)
      .post('/admin/health-insurances')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Test Insurance ${Date.now()}` })
    healthInsuranceId = insuranceResponse.body.id
  })

  beforeEach(async () => {
    // Clean up patients created during tests
    await db.patient.deleteMany({ where: { user: { email: { contains: 'new.patient' } } } })
    await db.user.deleteMany({ where: { email: { contains: 'new.patient' } } })
  })

  it('ADM-01: should list all patients', async () => {
    const response = await request(API_URL)
      .get('/admin/patients')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.patients)).toBe(true)
  })

  it('ADM-02: should create a new patient successfully', async () => {
    const newPatient = {
      name: 'New Patient',
      email: `new.patient.${Date.now()}@example.com`,
      password: 'password123',
      cpf: `123456789-${Date.now()}`,
      healthInsuranceId,
    }

    const response = await request(API_URL)
      .post('/admin/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newPatient)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('ADM-03: should fail to create a patient with a duplicate CPF', async () => {
    const uniqueCpf = `987654321-${Date.now()}`
    const patient1 = {
      name: 'Patient One',
      email: `new.patient.1.${Date.now()}@example.com`,
      password: 'password123',
      cpf: uniqueCpf,
      healthInsuranceId,
    }
    // Create the first patient
    await request(API_URL)
      .post('/admin/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(patient1)

    const patient2 = {
      name: 'Patient Two',
      email: `new.patient.2.${Date.now()}@example.com`,
      password: 'password123',
      cpf: uniqueCpf, // Same CPF
      healthInsuranceId,
    }
    // Attempt to create the second patient
    const response = await request(API_URL)
      .post('/admin/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(patient2)

    expect(response.status).toBe(409)
  })

  it('ADM-03.1: should fail with a non-existent healthInsuranceId', async () => {
    const patient = {
      name: 'Patient',
      email: `new.patient.invalid.${Date.now()}@example.com`,
      password: 'password123',
      cpf: `111222333-${Date.now()}`,
      healthInsuranceId: randomUUID(), // Invalid ID
    }
    const response = await request(API_URL)
      .post('/admin/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(patient)

    expect(response.status).toBe(400) // or 404
  });

  it('ADM-04: should update a patient successfully', async () => {
    // Find a seeded patient to update
    const user = await db.user.findUnique({ where: { email: SEEDED_USERS.patient1.email } })
    const patient = await db.patient.findUnique({ where: { userId: user!.id } })

    const response = await request(API_URL)
      .put(`/admin/patients/${patient!.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Paulo Updated' })

    expect(response.status).toBe(204)
  })

  it('ADM-04.1: should fail to update a non-existent patient', async () => {
    const response = await request(API_URL)
      .put(`/admin/patients/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Non Existent' });

    expect(response.status).toBe(404);
  });

  it('ADM-05: should delete a patient successfully', async () => {
    // Create a patient to be deleted
    const res = await request(API_URL)
      .post('/admin/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'To Be Deleted',
        email: `new.patient.delete.${Date.now()}@example.com`,
        password: 'password123',
        cpf: `delete-me-${Date.now()}`,
        healthInsuranceId,
      })

    const response = await request(API_URL)
      .delete(`/admin/patients/${res.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(204)
  })

  it('ADM-05.1: should fail to delete a non-existent patient', async () => {
    const response = await request(API_URL)
      .delete(`/admin/patients/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  it('ADM-06: should forbid access to non-admin users', async () => {
    const response = await request(API_URL)
      .get('/admin/patients')
      .set('Authorization', `Bearer ${patientToken}`) // Using patient token

    expect(response.status).toBe(403)
  })
})
