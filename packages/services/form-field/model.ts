import { z } from 'zod';

export const createFieldInput = z.object({
  label: z.string().min(1).max(100),
  labelKey: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean().optional(),
  index: z.number(),
  type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD', 'PDF', 'IMAGE', 'MULTIPLE_IMAGES', 'TEXTAREA', 'PHONE', 'DROPDOWN', 'CHECKBOX', 'RADIO', 'DATE', 'RATING', 'SIGNATURE', 'ADDRESS', 'TERMS']),
  formId: z.string().uuid(),
  configuration: z.string().optional().nullable(),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const createFieldResult = z.object({
  id: z.string().describe('The id of the created field'),
});

export type CreateFieldResultType = z.infer<typeof createFieldResult>;

export const updateFieldInput = z.object({
  id: z.string().uuid(),
  label: z.string().min(1).max(100).optional(),
  labelKey: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean().optional(),
  index: z.number().optional(),
  type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD', 'PDF', 'IMAGE', 'MULTIPLE_IMAGES', 'TEXTAREA', 'PHONE', 'DROPDOWN', 'CHECKBOX', 'RADIO', 'DATE', 'RATING', 'SIGNATURE', 'ADDRESS', 'TERMS']).optional(),
  configuration: z.string().optional().nullable(),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFieldInput = z.object({
  id: z.string().uuid(),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const getFieldInput = z.object({
  id: z.string().uuid(),
});

export type GetFieldInputType = z.infer<typeof getFieldInput>;

export const reorderFieldsInput = z.object({
  formId: z.string().uuid(),
  fieldIds: z.array(z.string().uuid()),
});

export type ReorderFieldsInputType = z.infer<typeof reorderFieldsInput>;

