import { db, eq, desc } from '@repo/database';
import { formFieldsTable } from '@repo/database/models/form-filed';
import {
  createFieldInput,
  CreateFieldInputType,
  createFieldResult,
  CreateFieldResultType,
  updateFieldInput,
  UpdateFieldInputType,
  deleteFieldInput,
  DeleteFieldInputType,
  reorderFieldsInput,
  ReorderFieldsInputType,
} from './model';

class FormFieldService {
  private serializeField(row: any) {
    return {
      id: row.id,
      label: row.label,
      labelKey: row.labelKey,
      description: row.description ?? null,
      placeholder: row.placeholder ?? null,
      isRequired: !!row.isRequired,
      index: String(row.index as unknown as string | number),
      type: row.type,
      formId: row.formId,
      configuration: row.configuration ?? null,
      createdAt: row.createdAt ? (row.createdAt as Date).toISOString() : null,
      updatedAt: row.updatedAt ? (row.updatedAt as Date).toISOString() : null,
    };
  }

  public async createField(payload: CreateFieldInputType) {
    const {
      label,
      labelKey,
      description,
      placeholder,
      isRequired,
      index,
      type,
      formId,
      configuration,
    } = await createFieldInput.parseAsync(payload);

    const insertResult = await db
      .insert(formFieldsTable)
      .values({
        label,
        labelKey,
        description: description ?? null,
        placeholder: placeholder ?? null,
        isRequired: isRequired ?? false,
        // Drizzle's numeric/decimal columns are represented as strings
        index: String(index),
        type,
        formId,
        configuration: configuration ?? null,
      })
      .returning({ id: formFieldsTable.id });

    if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
      throw new Error('Failed to create field');
    }

    return { id: insertResult[0].id } as CreateFieldResultType;
  }

  public async updateField(payload: UpdateFieldInputType) {
    const parsed = await updateFieldInput.parseAsync(payload);
    const { id, ...rest } = parsed;

    const updatePayload: Record<string, any> = {};
    for (const key of Object.keys(rest)) {
      const val = (rest as any)[key];
      if (val !== undefined) {
        // ensure numeric/decimal 'index' is passed as string to Drizzle
        if (key === 'index') {
          updatePayload[key] = String(val);
        } else {
          updatePayload[key] = val;
        }
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return { id };
    }

    const updateResult = await db
      .update(formFieldsTable)
      .set(updatePayload)
      .where(eq(formFieldsTable.id, id))
      .returning({ id: formFieldsTable.id });

    if (!updateResult || updateResult.length === 0 || !updateResult[0]?.id) {
      throw new Error('Failed to update field');
    }

    return { id: updateResult[0].id };
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { id } = await deleteFieldInput.parseAsync(payload);

    const deleteResult = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .returning({ id: formFieldsTable.id });

    if (!deleteResult || deleteResult.length === 0 || !deleteResult[0]?.id) {
      throw new Error('Failed to delete field');
    }

    return { id: deleteResult[0].id };
  }

  /**
   * Compute the next index for a form's fields.
   * Returns a string because the `numeric` column is represented as string in Drizzle.
   */
  public async getNextIndex(formId: string) {
    if (!formId) throw new Error('formId is required');

    const results = await db
      .select({ index: formFieldsTable.index })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(desc(formFieldsTable.index))
      .limit(1);

    if (!results || results.length === 0) {
      return '1.00';
    }

    const row = results[0]!;
    const maxIndexRaw = row.index as unknown as string | number;
    const maxNum = typeof maxIndexRaw === 'string' ? Number(maxIndexRaw) : (maxIndexRaw as number);
    const next = (isNaN(maxNum) ? 1 : maxNum + 1).toFixed(2);
    return next;
  }

  /**
   * Retrieve a single field by id. Returns null if not found.
   */
  public async getField(fieldId: string) {
    if (!fieldId) throw new Error('fieldId is required');

    const results = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        placeholder: formFieldsTable.placeholder,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        formId: formFieldsTable.formId,
        configuration: formFieldsTable.configuration,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, fieldId))
      .limit(1);

    if (!results || results.length === 0) return null;

    return this.serializeField(results[0]!);
  }

  public async listByFormId(formId: string) {
    if (!formId) throw new Error('formId is required');

    const results = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        placeholder: formFieldsTable.placeholder,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        formId: formFieldsTable.formId,
        configuration: formFieldsTable.configuration,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(formFieldsTable.index);

    return results.map((row) => this.serializeField(row));
  }

  public async reorderFields(payload: ReorderFieldsInputType) {
    const { formId, fieldIds } = await reorderFieldsInput.parseAsync(payload);

    await db.transaction(async (tx) => {
      // Step 1: Assign temporary indexes to avoid unique_form_id_index conflicts
      for (let i = 0; i < fieldIds.length; i++) {
        const id = fieldIds[i];
        if (!id) continue;
        await tx
          .update(formFieldsTable)
          .set({ index: String(10000 + i) })
          .where(eq(formFieldsTable.id, id));
      }

      // Step 2: Assign final sequential indexes (1, 2, 3, ...)
      for (let i = 0; i < fieldIds.length; i++) {
        const id = fieldIds[i];
        if (!id) continue;
        await tx
          .update(formFieldsTable)
          .set({ index: String(i + 1) })
          .where(eq(formFieldsTable.id, id));
      }
    });


    return { success: true };
  }
}

export default FormFieldService;
