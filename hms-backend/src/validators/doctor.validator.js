const { z } = require('zod');

const createDoctorSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8).max(100),
  first_name: z.string().min(1).max(100).trim(),
  last_name: z.string().min(1).max(100).trim(),
  department_id: z.string().min(1, 'Invalid department ID'),
  specialization: z.string().min(1).max(150).trim(),
  phone: z.string().max(20).optional(),
  qualification: z.string().max(255).optional(),
  experience_years: z.coerce.number().int().min(0).max(60).optional(),
  consultation_fee: z.coerce.number().min(0).optional(),
  bio: z.string().max(1000).optional(),
});

const updateDoctorSchema = z.object({
  department_id: z.string().optional(),
  specialization: z.string().min(1).max(150).trim().optional(),
  phone: z.string().max(20).optional(),
  qualification: z.string().max(255).optional(),
  experience_years: z.coerce.number().int().min(0).max(60).optional(),
  consultation_fee: z.coerce.number().min(0).optional(),
  bio: z.string().max(1000).optional(),
  is_available: z.boolean().optional(),
});

module.exports = { createDoctorSchema, updateDoctorSchema };
