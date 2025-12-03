import request from 'supertest'
import { db } from '@/lib/db'

const API_URL = process.env.API_URL || 'http://localhost:3333'

export const SEEDED_USERS = {
  admin: {
    email: 'ana.admin@example.com',
    password: 'password123',
  },
  doctor: {
    email: 'carlos.doctor@example.com',
    password: 'password123',
  },
  patient1: {
    email: 'paulo.patient@example.com',
    password: 'password123',
  },
  patient2: {
    email: 'pedro.patient@example.com',
    password: 'password123',
  },
}

export type UserKey = keyof typeof SEEDED_USERS

export async function getAuthToken(
  user: UserKey,
): Promise<string> {
  const credentials = SEEDED_USERS[user]
  const response = await request(API_URL)
    .post('/auth/signin')
    .send(credentials)

  if (response.status !== 201) {
    throw new Error(`Failed to sign in user ${credentials.email}. Status: ${
      response.status
    } Body: ${JSON.stringify(response.body)}`)
  }

  return response.body.accessToken
}

export async function getSeededDoctor() {
  const doctor = await db.doctor.findFirst({
    where: {
      user: {
        email: SEEDED_USERS.doctor.email,
      },
    },
    include: {
      user: true,
    },
  })

  if (!doctor) {
    throw new Error('Seeded doctor not found. Make sure global setup ran correctly.')
  }

  return {
    userId: doctor.userId,
    doctorId: doctor.id,
    crm: doctor.crm,
  }
}
