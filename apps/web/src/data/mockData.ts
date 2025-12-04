export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  experience: string;
  rating: number;
  avatarUrl: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: "Agendada" | "Cancelada" | "Realizada" | "Falta";
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
}

export interface Convenio {
  id: string;
  name: string;
  registrationNumber: string;
  active: boolean;
}

export const convenios: Convenio[] = [
  { id: "1", name: "Unimed", registrationNumber: "ANS 123456", active: true },
  { id: "2", name: "Bradesco Saúde", registrationNumber: "ANS 234567", active: true },
  { id: "3", name: "Amil", registrationNumber: "ANS 345678", active: true },
  { id: "4", name: "SulAmérica", registrationNumber: "ANS 456789", active: true },
];

export const specialties: Specialty[] = [
  { id: "cardiologia", name: "Cardiologia", icon: "Heart" },
  { id: "dermatologia", name: "Dermatologia", icon: "Sparkles" },
  { id: "ortopedia", name: "Ortopedia", icon: "Bone" },
  { id: "neurologia", name: "Neurologia", icon: "Brain" },
  { id: "oftalmologia", name: "Oftalmologia", icon: "Eye" },
  { id: "pediatria", name: "Pediatria", icon: "Baby" },
];

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Carlos Silva",
    crm: "CRM/SP 123456",
    specialty: "cardiologia",
    experience: "15 anos de experiência",
    rating: 4.9,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  },
  {
    id: "2",
    name: "Dra. Maria Santos",
    crm: "CRM/SP 234567",
    specialty: "cardiologia",
    experience: "12 anos de experiência",
    rating: 4.8,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: "3",
    name: "Dr. João Oliveira",
    crm: "CRM/SP 345678",
    specialty: "dermatologia",
    experience: "10 anos de experiência",
    rating: 4.7,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
  },
  {
    id: "4",
    name: "Dra. Ana Paula",
    crm: "CRM/SP 456789",
    specialty: "dermatologia",
    experience: "18 anos de experiência",
    rating: 4.9,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
  },
  {
    id: "5",
    name: "Dr. Ricardo Costa",
    crm: "CRM/SP 567890",
    specialty: "ortopedia",
    experience: "20 anos de experiência",
    rating: 4.8,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo",
  },
  {
    id: "6",
    name: "Dra. Fernanda Lima",
    crm: "CRM/SP 678901",
    specialty: "ortopedia",
    experience: "14 anos de experiência",
    rating: 4.7,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda",
  },
  {
    id: "7",
    name: "Dr. Paulo Mendes",
    crm: "CRM/SP 789012",
    specialty: "neurologia",
    experience: "22 anos de experiência",
    rating: 4.9,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo",
  },
  {
    id: "8",
    name: "Dra. Juliana Rocha",
    crm: "CRM/SP 890123",
    specialty: "neurologia",
    experience: "16 anos de experiência",
    rating: 4.8,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana",
  },
  {
    id: "9",
    name: "Dr. Roberto Alves",
    crm: "CRM/SP 901234",
    specialty: "oftalmologia",
    experience: "19 anos de experiência",
    rating: 4.7,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
  },
  {
    id: "10",
    name: "Dra. Beatriz Nunes",
    crm: "CRM/SP 012345",
    specialty: "oftalmologia",
    experience: "11 anos de experiência",
    rating: 4.8,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
  },
  {
    id: "11",
    name: "Dr. Eduardo Ferreira",
    crm: "CRM/SP 123450",
    specialty: "pediatria",
    experience: "17 anos de experiência",
    rating: 4.9,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo",
  },
  {
    id: "12",
    name: "Dra. Camila Souza",
    crm: "CRM/SP 234561",
    specialty: "pediatria",
    experience: "13 anos de experiência",
    rating: 4.9,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camila",
  },
];

export const patients: Patient[] = [
  {
    id: "1",
    name: "João da Silva",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    cpf: "234.567.890-11",
    phone: "(11) 97654-3210",
  },
];

export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    date: "2024-12-15",
    time: "09:00",
    status: "Agendada",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "3",
    date: "2024-12-16",
    time: "14:00",
    status: "Agendada",
  },
];

// Generate available time slots
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 17) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

// Generate available dates for the next 7 days
export const generateAvailableDates = (): { date: string; dayName: string; dayNumber: string }[] => {
  const dates = [];
  const today = new Date();
  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: date.toISOString().split("T")[0],
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate().toString(),
    });
  }
  
  return dates;
};
