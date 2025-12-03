import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { getAuthToken, getSeededDoctor } from '../helpers.js'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('Patient Module', () => {
  let patient1Token: string
  let patient2Token: string
  let doctorToken: string
  let seededDoctor: { userId: string; doctorId: string; crm: string }

  beforeAll(async () => {
    patient1Token = await getAuthToken('patient1')
    patient2Token = await getAuthToken('patient2')
    doctorToken = await getAuthToken('doctor')
    seededDoctor = await getSeededDoctor()
  })

  beforeEach(async () => {
    // Clean up created appointments and blocks before each test
    await db.appointment.deleteMany({})
    await db.scheduleBlock.deleteMany({})
  })

  describe('POST /appointments - Schedule Appointment', () => {
    it('PAC-01: should schedule a new appointment successfully', async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000) // 30 mins later

      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.doctorId).toBe(seededDoctor.doctorId)
    })

    it('PAC-02: should fail to schedule with a time conflict', async () => {
      const startTime = new Date(Date.now() + 48 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

      // Create an initial appointment
      await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      // Attempt to create a conflicting appointment
      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(409)
    })

    it('PAC-02.1: should fail to schedule when doctor has blocked the schedule', async () => {
      const startTime = new Date(Date.now() + 72 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 2 hour block

      // Doctor blocks the schedule
      await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'Lunch break',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });

      // Patient tries to book inside the block
      const appointmentStartTime = new Date(startTime.getTime() + 30 * 60 * 1000);
      const appointmentEndTime = new Date(appointmentStartTime.getTime() + 30 * 60 * 1000);

      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: appointmentStartTime.toISOString(),
          endTime: appointmentEndTime.toISOString(),
        });

      expect(response.status).toBe(409);
    });

    it('PAC-03: should fail if the doctor does not exist', async () => {
      const startTime = new Date(Date.now() + 96 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: randomUUID(), // Non-existent doctor
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(404)
    })

    it('PAC-04: should return 403 Forbidden if a doctor tries to schedule', async () => {
      const startTime = new Date(Date.now() + 120 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${doctorToken}`) // Using doctor token
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(403)
    })

    it('PAC-04.1: should fail if scheduling in the past', async () => {
      const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(400)
    })

    it('PAC-04.2: should fail with invalid duration (end <= start)', async () => {
      const startTime = new Date(Date.now() + 144 * 60 * 60 * 1000)

      const response = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: startTime.toISOString(), // End time is same as start time
        })

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /appointments/{id}/cancel - Cancel Appointment', () => {
    let appointmentId: string;

    beforeEach(async () => {
      const startTime = new Date(Date.now() + 168 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
      const res = await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });
      appointmentId = res.body.id;
    });

    it('PAC-05: should cancel an appointment successfully', async () => {
      const response = await request(API_URL)
        .patch(`/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${patient1Token}`)

      expect(response.status).toBe(204)
    })

    it('PAC-06: should fail to cancel an appointment of another patient', async () => {
      const response = await request(API_URL)
        .patch(`/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${patient2Token}`); // Use second patient's token

      expect(response.status).toBe(403);
    });


    it('PAC-07: should fail if appointment does not exist', async () => {
      const response = await request(API_URL)
        .patch(`/appointments/${randomUUID()}/cancel`)
        .set('Authorization', `Bearer ${patient1Token}`)

      expect(response.status).toBe(404)
    })

    it('PAC-07.1: should fail to cancel an already canceled appointment', async () => {
      // First cancellation
      await request(API_URL)
        .patch(`/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${patient1Token}`);

      // Second cancellation attempt
      const response = await request(API_URL)
        .patch(`/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${patient1Token}`);

      expect(response.status).toBe(409);
    });
  })

  describe('GET /patients/me/appointments - List My Appointments', () => {
    it('PAC-08: should return a list of appointments for the logged-in patient', async () => {
      const response = await request(API_URL)
        .get('/patients/me/appointments')
        .set('Authorization', `Bearer ${patient1Token}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.appointments)).toBe(true)
    })

    it('PAC-09: should fail with an invalid token', async () => {
      const response = await request(API_URL)
        .get('/patients/me/appointments')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toBe(401)
    })
  })
})
