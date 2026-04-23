const { z } = require('zod');

const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .max(255)
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required')
    .max(100)
    .trim(),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(100)
    .trim(),
  role: z
    .enum(['patient'], {
      errorMap: () => ({ message: 'Self-registration is only available for patients' }),
    })
    .default('patient'),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

const registerVerifySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
  otp: z
    .string({ required_error: 'OTP is required' })
    .length(6, 'OTP must be exactly 6 digits'),
});

const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
  otp: z
    .string({ required_error: 'OTP is required' })
    .length(6, 'OTP must be exactly 6 digits'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

const verifyOtpSchema = z.object({
  identifier: z
    .string({ required_error: 'Identifier is required' })
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
  otp: z
    .string({ required_error: 'OTP is required' })
    .length(6, 'OTP must be exactly 6 digits'),
});

module.exports = { registerSchema, loginSchema, registerVerifySchema, resetPasswordSchema, verifyOtpSchema };
