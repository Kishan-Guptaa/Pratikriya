import { z } from 'zod';

export const TAGS = ['FormField'];

export const createFieldInputModel = z.object({
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

export const createFieldOutputModel = z.object({
  id: z.string(),
});

export const updateFieldInputModel = z.object({
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

export const updateFieldOutputModel = z.object({
  id: z.string(),
});

export const deleteFieldInputModel = z.object({
  id: z.string().uuid(),
});

export const deleteFieldOutputModel = z.object({
  id: z.string(),
});

export const getNextIndexInputModel = z.object({
  formId: z.string().uuid(),
});

export const getNextIndexOutputModel = z.object({
  index: z.string(),
});

export const getFieldInputModel = z.object({
  id: z.string().uuid(),
});

export const getFieldOutputModel = z.object({
  id: z.string(),
  label: z.string(),
  labelKey: z.string(),
  description: z.string().optional().nullable(),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean(),
  index: z.string(),
  type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD', 'PDF', 'IMAGE', 'MULTIPLE_IMAGES', 'TEXTAREA', 'PHONE', 'DROPDOWN', 'CHECKBOX', 'RADIO', 'DATE', 'RATING', 'SIGNATURE', 'ADDRESS', 'TERMS']),
  formId: z.string().uuid(),
  configuration: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export const listFieldsByFormIdInputModel = z.object({
  formId: z.string().uuid(),
});

export const listFieldsByFormIdOutputModel = z.array(getFieldOutputModel);

export const reorderFieldsInputModel = z.object({
  formId: z.string().uuid(),
  fieldIds: z.array(z.string().uuid()),
});

export const reorderFieldsOutputModel = z.object({
  success: z.boolean(),
});

