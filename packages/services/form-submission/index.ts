import { db, eq, desc } from '@repo/database';
import { formSubmissionTable } from '@repo/database/models/form-submission';
import { formsTable } from '@repo/database/models/form';
import { z } from 'zod';

const createSubmissionInput = z.object({
  formId: z.string().uuid(),
  values: z.array(z.object({ formFieldId: z.string().uuid(), value: z.string().nullable() })),
});

type CreateSubmissionInput = z.infer<typeof createSubmissionInput>;

class FormSubmissionService {
  public async createSubmission(payload: CreateSubmissionInput) {
    const { formId, values } = await createSubmissionInput.parseAsync(payload);

    const normalizedValues = values.map((entry) => ({
      ...entry,
      value: entry.value ?? '',
    }));

    const insertResult = await db
      .insert(formSubmissionTable)
      .values({ formId, values: normalizedValues })
      .returning({ id: formSubmissionTable.id });

    if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
      throw new Error('Failed to create submission');
    }

    return { id: insertResult[0].id };
  }

  public async getFormSubmissionsByFormId(formId: string) {
    return this.listByFormId(formId);
  }

  public async listByFormId(formId: string) {
    if (!formId) return [];

    const results = await db
      .select({
        id: formSubmissionTable.id,
        formId: formSubmissionTable.formId,
        values: formSubmissionTable.values,
        createdAt: formSubmissionTable.createdAt,
        updatedAt: formSubmissionTable.updatedAt,
      })
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, formId))
      .orderBy(desc(formSubmissionTable.createdAt));

    return results.map((r) => ({
      ...r,
      createdAt: r.createdAt ? (r.createdAt as Date).toISOString() : null,
      updatedAt: r.updatedAt ? (r.updatedAt as Date).toISOString() : null,
    }));
  }

  public async listAllForUser(userId: string) {
    if (!userId) return [];

    const results = await db
      .select({
        id: formSubmissionTable.id,
        formId: formSubmissionTable.formId,
        values: formSubmissionTable.values,
        createdAt: formSubmissionTable.createdAt,
        updatedAt: formSubmissionTable.updatedAt,
      })
      .from(formSubmissionTable)
      .innerJoin(formsTable, eq(formSubmissionTable.formId, formsTable.id))
      .where(eq(formsTable.createdBy, userId))
      .orderBy(desc(formSubmissionTable.createdAt));

    return results.map((r) => ({
      ...r,
      createdAt: r.createdAt ? (r.createdAt as Date).toISOString() : null,
      updatedAt: r.updatedAt ? (r.updatedAt as Date).toISOString() : null,
    }));
  }
}

export default FormSubmissionService;
