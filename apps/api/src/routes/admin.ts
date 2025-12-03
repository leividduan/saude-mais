import { FastifyPluginAsync } from 'fastify';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { CreatePatientController } from '../controllers/admin/patient/CreatePatientController';
import { DeletePatientController } from '../controllers/admin/patient/DeletePatientController';
import { ListPatientsController } from '../controllers/admin/patient/ListPatientsController';
import { UpdatePatientController } from '../controllers/admin/patient/UpdatePatientController';
import { CreateDoctorController } from '../controllers/admin/doctor/CreateDoctorController';
import { DeleteDoctorController } from '../controllers/admin/doctor/DeleteDoctorController';
import { ListDoctorsController } from '../controllers/admin/doctor/ListDoctorsController';
import { UpdateDoctorController } from '../controllers/admin/doctor/UpdateDoctorController';
import { CreateHealthInsuranceController } from '../controllers/admin/health-insurance/CreateHealthInsuranceController';
import { DeleteHealthInsuranceController } from '../controllers/admin/health-insurance/DeleteHealthInsuranceController';
import { ListHealthInsurancesController } from '../controllers/admin/health-insurance/ListHealthInsurancesController';
import { UpdateHealthInsuranceController } from '../controllers/admin/health-insurance/UpdateHealthInsuranceController';
import { AppointmentsByInsuranceController } from '../controllers/admin/report/AppointmentsByInsuranceController';

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', adminMiddleware);

  // Patient CRUD
  fastify.get('/patients', ListPatientsController.handler);
  fastify.post('/patients', CreatePatientController.handler);
  fastify.put('/patients/:id', UpdatePatientController.handler);
  fastify.delete('/patients/:id', DeletePatientController.handler);

  // Doctor CRUD
  fastify.get('/doctors', ListDoctorsController.handler);
  fastify.post('/doctors', CreateDoctorController.handler);
  fastify.put('/doctors/:id', UpdateDoctorController.handler);
  fastify.delete('/doctors/:id', DeleteDoctorController.handler);

  // Health Insurance CRUD
  fastify.get('/health-insurances', ListHealthInsurancesController.handler);
  fastify.post('/health-insurances', CreateHealthInsuranceController.handler);
  fastify.put('/health-insurances/:id', UpdateHealthInsuranceController.handler);
  fastify.delete('/health-insurances/:id', DeleteHealthInsuranceController.handler);

  // Reports
  fastify.get(
    '/reports/appointments-by-insurance',
    AppointmentsByInsuranceController.handler
  );
};
