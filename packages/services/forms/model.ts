import { z } from 'zod';

export const createFormInput = z.object({
  title: z.string().min(1).max(55).describe('The title of the form'),
  description: z.string().max(300).optional().nullable().describe('Optional description for the form'),
  createdBy: z.string().uuid().optional().describe('User id who created the form'),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const createFormResult = z.object({
  id: z.string().describe('The id of the created form'),
});

export type CreateFormResultType = z.infer<typeof createFormResult>;
