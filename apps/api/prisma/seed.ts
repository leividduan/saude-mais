import { hash } from 'bcryptjs';
import { AppointmentStatus, PrismaClient, Role } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- Health Insurances ---
  const healthInsurance1 = await prisma.healthInsurance.upsert({
    where: { name: 'Amil' },
    update: {},
    create: {
      name: 'Amil',
    },
  });

  const healthInsurance2 = await prisma.healthInsurance.upsert({
    where: { name: 'Bradesco Saúde' },
    update: {},
    create: {
      name: 'Bradesco Saúde',
    },
  });

  console.log('Created health insurances:', healthInsurance1.name, healthInsurance2.name);

  // --- Admin User ---
  const hashedPasswordAdmin = await hash('password123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: Role.ADMIN,
    },
  });
  console.log('Created admin user:', adminUser.email);

  // --- Doctor User and Profile ---
  const hashedPasswordDoctor = await hash('password123', 10);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      name: 'Dr. John Doe',
      email: 'doctor@example.com',
      password: hashedPasswordDoctor,
      role: Role.DOCTOR,
      doctor: {
        create: {
          crm: 'CRM/SP 123456',
          specialty: 'Cardiologia',
        },
      },
    },
  });
  console.log('Created doctor user and profile:', doctorUser.email);

  // --- Patient User and Profile ---
  const hashedPasswordPatient = await hash('password123', 10);
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'patient@example.com',
      password: hashedPasswordPatient,
      role: Role.PATIENT,
      patient: {
        create: {
          cpf: '111.222.333-44',
          phone: '(11) 98765-4321',
          healthInsuranceId: healthInsurance1.id, // Link to Amil
        },
      },
    },
  });
  console.log('Created patient user and profile:', patientUser.email);

  // --- Schedule Block for Doctor ---
  const doctorProfile = await prisma.doctor.findUnique({ where: { userId: doctorUser.id } });
  if (doctorProfile) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // Tomorrow 9:00 AM
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(10, 0, 0, 0); // Tomorrow 10:00 AM

    const scheduleBlock = await prisma.scheduleBlock.upsert({
      where: {
        id: 'd3b8f8f0-3230-4e5a-a7a9-0683c3e82480', // Hardcoded UUID for idempotency
      },
      update: {
        startTime: tomorrow,
        endTime: tomorrowEnd,
        reason: 'Meeting',
      },
      create: {
        startTime: tomorrow,
        endTime: tomorrowEnd,
        reason: 'Meeting',
        doctorId: doctorProfile.userId,
      },
    });
    console.log('Created schedule block for doctor:', scheduleBlock.id);

    // --- Sample Appointment ---
    const appointmentStartTime = new Date(tomorrow);
    appointmentStartTime.setHours(11, 0, 0, 0); // Tomorrow 11:00 AM
    const appointmentEndTime = new Date(tomorrow);
    appointmentEndTime.setHours(11, 30, 0, 0); // Tomorrow 11:30 AM

    await prisma.appointment.upsert({
      where: { id: 'e7b3c4f5-1786-442b-9c7b-3292430b561e' }, // Hardcoded UUID for idempotency,
      update: {
        startTime: appointmentStartTime,
        endTime: appointmentEndTime,
        status: AppointmentStatus.SCHEDULED,
      },
      create: {
        startTime: appointmentStartTime,
        endTime: appointmentEndTime,
        status: AppointmentStatus.SCHEDULED,
        doctorId: doctorProfile.userId,
        patientId: patientUser.id,
      },
    });
    console.log('Created sample appointment.');
  } else {
    console.warn('Doctor profile not found, skipping schedule block and appointment creation.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
