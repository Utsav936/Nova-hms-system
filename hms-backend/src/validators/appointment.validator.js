const { z } = require('zod');

const createAppointmentSchema = z.object({
  patient_id: z.string(),
  doctor_id: z.string(),
  appointment_date: z.string(),
  appointment_time: z.string(),
  type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']).default('consultation'),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

const updateAppointmentSchema = z.object({
  appointment_date: z.string().optional(),
  appointment_time: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']).optional(),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

module.exports = { createAppointmentSchema, updateAppointmentSchema };
