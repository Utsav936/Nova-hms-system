const { z } = require('zod');

const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(100).trim(),
  description: z.string().max(500).optional(),
});

const updateDepartmentSchema = createDepartmentSchema.partial();

const createMedicalRecordSchema = z.object({
  patient_id: z.string().uuid('Invalid patient ID'),
  appointment_id: z.string().uuid('Invalid appointment ID').optional(),
  diagnosis: z.string().min(1, 'Diagnosis is required').max(2000),
  symptoms: z.string().max(2000).optional(),
  treatment: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
  prescriptions: z.array(z.object({
    medication_name: z.string().min(1).max(200),
    dosage: z.string().min(1).max(100),
    frequency: z.string().min(1).max(100),
    duration: z.string().max(100).optional(),
    instructions: z.string().max(500).optional(),
  })).optional(),
});

const updateMedicalRecordSchema = z.object({
  diagnosis: z.string().max(2000).optional(),
  symptoms: z.string().max(2000).optional(),
  treatment: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
};
