import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';
import PDFDocument from 'pdfkit';

const schema = z.object({
  healthInsuranceId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class AppointmentsByInsuranceController {
  static async handler(
    request: FastifyRequest<{ Querystring: z.infer<typeof schema> }>,
    reply: FastifyReply
  ) {
    const { healthInsuranceId, startDate, endDate } = schema.parse(request.query);

    const healthInsurance = await db.healthInsurance.findUnique({
      where: { id: healthInsuranceId },
    });

    if (!healthInsurance) {
      return reply.status(404).send({ error: 'Health insurance not found.' });
    }

    const where: any = {
      patient: {
        healthInsuranceId,
      },
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.startTime.lte = new Date(endDate);
      }
    }

    const appointments = await db.appointment.findMany({
      where,
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    const doc = new PDFDocument({ margin: 50 });

    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename="report.pdf"`);
    
    doc.pipe(reply.raw);

    // --- PDF Content ---
    doc.fontSize(18).text(`Relatório de Consultas - ${healthInsurance.name}`, { align: 'center' });
    doc.moveDown();

    if (startDate || endDate) {
      const period = [
        startDate ? `de ${new Date(startDate).toLocaleDateString()}` : '',
        endDate ? `até ${new Date(endDate).toLocaleDateString()}` : '',
      ].filter(Boolean).join(' ');
      doc.fontSize(12).text(`Período: ${period}`, { align: 'center' });
      doc.moveDown();
    }
    
    if (appointments.length === 0) {
      doc.fontSize(12).text('Nenhuma consulta encontrada para os filtros selecionados.');
    } else {
      doc.fontSize(14).text('Consultas:', { underline: true });
      doc.moveDown();

      appointments.forEach((apt) => {
        doc.fontSize(12).text(`Data: ${apt.startTime.toLocaleString()}`);
        doc.text(`Paciente: ${apt.patient.user.name}`);
        doc.text(`Médico: ${apt.doctor.user.name} (${apt.doctor.specialty})`);
        doc.text(`Status: ${apt.status}`);
        doc.moveDown();
      });
    }
    // --- End PDF Content ---

    doc.end();

    // The reply is sent by piping the stream, so we should not call reply.send()
    // but fastify needs a return value. We are letting fastify handle the reply stream.
  }
}
