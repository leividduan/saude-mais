import { Doctor, Patient, Convenio, doctors as initialDoctors, patients as initialPatients, convenios as initialConvenios } from "@/data/mockData";

const STORAGE_KEYS = {
  doctors: "clinica_doctors",
  patients: "clinica_patients",
  convenios: "clinica_convenios",
};

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.doctors)) {
    localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(initialDoctors));
  }
  if (!localStorage.getItem(STORAGE_KEYS.patients)) {
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(initialPatients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.convenios)) {
    localStorage.setItem(STORAGE_KEYS.convenios, JSON.stringify(initialConvenios));
  }
};

initializeStorage();

// DOCTORS
export const getDoctors = (): Doctor[] => {
  const data = localStorage.getItem(STORAGE_KEYS.doctors);
  return data ? JSON.parse(data) : [];
};

export const addDoctor = (doctor: Omit<Doctor, "id">): Doctor => {
  const doctors = getDoctors();
  const newDoctor = { ...doctor, id: Date.now().toString() };
  doctors.push(newDoctor);
  localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(doctors));
  return newDoctor;
};

export const updateDoctor = (id: string, doctor: Partial<Doctor>): Doctor | null => {
  const doctors = getDoctors();
  const index = doctors.findIndex((d) => d.id === id);
  if (index === -1) return null;
  doctors[index] = { ...doctors[index], ...doctor };
  localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(doctors));
  return doctors[index];
};

export const deleteDoctor = (id: string): boolean => {
  const doctors = getDoctors();
  const filtered = doctors.filter((d) => d.id !== id);
  if (filtered.length === doctors.length) return false;
  localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(filtered));
  return true;
};

// PATIENTS
export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(STORAGE_KEYS.patients);
  return data ? JSON.parse(data) : [];
};

export const addPatient = (patient: Omit<Patient, "id">): Patient => {
  const patients = getPatients();
  const newPatient = { ...patient, id: Date.now().toString() };
  patients.push(newPatient);
  localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
  return newPatient;
};

export const updatePatient = (id: string, patient: Partial<Patient>): Patient | null => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;
  patients[index] = { ...patients[index], ...patient };
  localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
  return patients[index];
};

export const deletePatient = (id: string): boolean => {
  const patients = getPatients();
  const filtered = patients.filter((p) => p.id !== id);
  if (filtered.length === patients.length) return false;
  localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(filtered));
  return true;
};

// CONVENIOS
export const getConvenios = (): Convenio[] => {
  const data = localStorage.getItem(STORAGE_KEYS.convenios);
  return data ? JSON.parse(data) : [];
};

export const addConvenio = (convenio: Omit<Convenio, "id">): Convenio => {
  const convenios = getConvenios();
  const newConvenio = { ...convenio, id: Date.now().toString() };
  convenios.push(newConvenio);
  localStorage.setItem(STORAGE_KEYS.convenios, JSON.stringify(convenios));
  return newConvenio;
};

export const updateConvenio = (id: string, convenio: Partial<Convenio>): Convenio | null => {
  const convenios = getConvenios();
  const index = convenios.findIndex((c) => c.id === id);
  if (index === -1) return null;
  convenios[index] = { ...convenios[index], ...convenio };
  localStorage.setItem(STORAGE_KEYS.convenios, JSON.stringify(convenios));
  return convenios[index];
};

export const deleteConvenio = (id: string): boolean => {
  const convenios = getConvenios();
  const filtered = convenios.filter((c) => c.id !== id);
  if (filtered.length === convenios.length) return false;
  localStorage.setItem(STORAGE_KEYS.convenios, JSON.stringify(filtered));
  return true;
};
