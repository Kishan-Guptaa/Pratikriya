import { z } from 'zod';

export const TAGS = ['FormSubmission'];

export const createSubmissionInputModel = z.object({
  formId: z.string().uuid(),
  values: z.array(
    z.object({
      formFieldId: z.string().uuid(),
      value: z.string().nullable(),
    })
  ),
});

export const createSubmissionOutputModel = z.object({
  id: z.string().uuid(),
});

export const listSubmissionsByFormIdInputModel = z.object({
  formId: z.string().uuid(),
});

export const listSubmissionsByFormIdOutputModel = z.array(
  z.object({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    values: z.array(
      z.object({
        formFieldId: z.string().uuid(),
        value: z.string().nullable(),
      })
    ),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
  })
);