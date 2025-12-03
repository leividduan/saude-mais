import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import { db } from '@/lib/db'
import { getAuthToken, getSeededDoctor } from '../helpers.js'

const API_URL = process.env.API_URL || 'http://localhost:3333'

describe('Doctor Module', () => {
  let doctorToken: string
  let patientToken: string
  let seededDoctor: { userId: string; doctorId: string; crm: string }

  beforeAll(async () => {
    doctorToken = await getAuthToken('doctor')
    patientToken = await getAuthToken('patient1')
    seededDoctor = await getSeededDoctor()
  })

  beforeEach(async () => {
    await db.appointment.deleteMany({})
    await db.scheduleBlock.deleteMany({})
  })

  describe('GET /doctors/me/agenda - View Agenda', () => {
    it('MED-01: should allow a doctor to see their own agenda', async () => {
      // Create an appointment for the doctor
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)
      await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      const response = await request(API_URL)
        .get('/doctors/me/agenda')
        .set('Authorization', `Bearer ${doctorToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.appointments)).toBe(true)
      expect(response.body.appointments.length).toBeGreaterThan(0)
    })

    it('MED-02: should forbid access to a patient trying to see a doctor agenda', async () => {
      const response = await request(API_URL)
        .get('/doctors/me/agenda')
        .set('Authorization', `Bearer ${patientToken}`)

      expect(response.status).toBe(403)
    })
  })

  describe('POST /doctors/me/schedule-blocks - Block Schedule', () => {
    it('MED-03: should block a period in the schedule successfully', async () => {
      const startTime = new Date(Date.now() + 48 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1-hour block

      const response = await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'Meeting',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.reason).toBe('Meeting')
    })

    it('MED-04: should fail with an invalid period (startTime > endTime)', async () => {
      const startTime = new Date(Date.now() + 72 * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() - 60 * 60 * 1000) // End time is before start time

      const response = await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'Invalid Block',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })

      expect(response.status).toBe(400)
    })

    it('MED-05: should fail if there is a conflict with an existing appointment', async () => {
      // Create an appointment first
      const appointmentStartTime = new Date(Date.now() + 96 * 60 * 60 * 1000)
      const appointmentEndTime = new Date(
        appointmentStartTime.getTime() + 30 * 60 * 1000,
      )
      await request(API_URL)
        .post('/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: seededDoctor.doctorId,
          startTime: appointmentStartTime.toISOString(),
          endTime: appointmentEndTime.toISOString(),
        })

      // Attempt to block a schedule that overlaps with the appointment
      const blockStartTime = new Date(appointmentStartTime.getTime() - 15 * 60 * 1000)
      const blockEndTime = new Date(appointmentStartTime.getTime() + 15 * 60 * 1000)

      const response = await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'Overlapping Block',
          startTime: blockStartTime.toISOString(),
          endTime: blockEndTime.toISOString(),
        })

      expect(response.status).toBe(409)
    })

    it('MED-05.1: should fail if there is a conflict with another block', async () => {
      // Create an initial block
      const block1StartTime = new Date(Date.now() + 120 * 60 * 60 * 1000);
      const block1EndTime = new Date(block1StartTime.getTime() + 60 * 60 * 1000);
      await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'First Block',
          startTime: block1StartTime.toISOString(),
          endTime: block1EndTime.toISOString(),
        });

      // Attempt to create an overlapping block
      const block2StartTime = new Date(block1StartTime.getTime() + 30 * 60 * 1000);
      const block2EndTime = new Date(block2StartTime.getTime() + 60 * 60 * 1000);
      const response = await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'Second Block',
          startTime: block2StartTime.toISOString(),
          endTime: block2EndTime.toISOString(),
        });

      expect(response.status).toBe(409);
    });

    it('MED-05.2: should fail to block a period in the past', async () => {
      const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const response = await request(API_URL)
        .post('/doctors/me/schedule-blocks')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          reason: 'Past Block',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });

      expect(response.status).toBe(400);
    });
  })
})
