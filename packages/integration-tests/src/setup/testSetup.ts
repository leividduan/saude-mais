import { beforeAll } from 'vitest'
import { db } from '@saude/api/lib/db'
import { hash } from 'bcryptjs'

beforeAll(async () => {
  console.log('Seeding database for tests...')

  // Clean existing test data
  await db.user.deleteMany({
    where: { email: { contains: '@example.com' } },
  })

  // Create Admin User (Ana)
  const adminPassword = await hash('password123', 8)
  await db.user.create({
    data: {
      name: 'Ana (Admin)',
      email: 'ana.admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create Doctor User (Dr. Carlos)
  const doctorPassword = await hash('password123', 8)
  const doctorUser = await db.user.create({
    data: {
      name: 'Dr. Carlos (Doctor)',
      email: 'carlos.doctor@example.com',
      password: doctorPassword,
      role: 'DOCTOR',
    },
  })

  // Create Doctor Profile
  await db.doctor.create({
    data: {
      userId: doctorUser.id,
      crm: `CRM-${Date.now()}`,
      specialty: 'Cardiology'
    }
  })

  // Create Patient User 1 (Paulo)
  const patientPassword = await hash('password123', 8)
  await db.user.create({
    data: {
      name: 'Paulo (Patient)',
      email: 'paulo.patient@example.com',
      password: patientPassword,
      role: 'PATIENT',
    },
  })

  // Create Patient User 2 (Pedro)
  const patient2Password = await hash('password123', 8)
  await db.user.create({
    data: {
      name: 'Pedro (Patient)',
      email: 'pedro.patient@example.com',
      password: patient2Password,
      role: 'PATIENT',
    },
  })

  console.log('Database seeded successfully.')
})
