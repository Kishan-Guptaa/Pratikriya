import { db, eq, desc } from '@repo/database';
import { formsTable } from '@repo/database/models/form';
import { formFieldsTable } from '@repo/database/models/form-filed';
import { formSubmissionTable } from '@repo/database/models/form-submission';
import { createFormInput, CreateFormInputType } from './model';

class FormService {
	public async createForm(payload: CreateFormInputType) {
		const { title, description, createdBy } = await createFormInput.parseAsync(payload);

		const insertResult = await db
			.insert(formsTable)
			.values({
				title,
				description: description ?? null,
				acceptsResponses: true,
				createdBy: createdBy ?? null,
			})
			.returning({ id: formsTable.id });

		if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
			throw new Error('Failed to create form');
		}

		return { id: insertResult[0].id };
	}

	public async listFormsByUserId(userId: string) {
		if (!userId) return [];

		const results = await db
			.select({
				id: formsTable.id,
				title: formsTable.title,
				description: formsTable.description,
				acceptsResponses: formsTable.acceptsResponses,
				createdBy: formsTable.createdBy,
				createdAt: formsTable.createdAt,
				updatedAt: formsTable.updatedAt,
			})
			.from(formsTable)
			.where(eq(formsTable.createdBy, userId))
			.orderBy(desc(formsTable.createdAt));

		// Convert Date objects to ISO strings to match API output schema
		return results.map((r) => ({
			...r,
			createdAt: r.createdAt ? (r.createdAt as Date).toISOString() : null,
			updatedAt: r.updatedAt ? (r.updatedAt as Date).toISOString() : null,
		}));
	}

	public async getFormByFormId(formId: string) {
		if (!formId) throw new Error('formId is required');

		const rows = await db
			.select({
				formId: formsTable.id,
				title: formsTable.title,
				description: formsTable.description,
				acceptsResponses: formsTable.acceptsResponses,
				createdBy: formsTable.createdBy,
				createdAt: formsTable.createdAt,
				updatedAt: formsTable.updatedAt,
				fieldId: formFieldsTable.id,
				label: formFieldsTable.label,
				labelKey: formFieldsTable.labelKey,
				fieldDescription: formFieldsTable.description,
				placeholder: formFieldsTable.placeholder,
				isRequired: formFieldsTable.isRequired,
				index: formFieldsTable.index,
				type: formFieldsTable.type,
				fieldFormId: formFieldsTable.formId,
				configuration: formFieldsTable.configuration,
				fieldCreatedAt: formFieldsTable.createdAt,
				fieldUpdatedAt: formFieldsTable.updatedAt,
			})
			.from(formsTable)
			.leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
			.where(eq(formsTable.id, formId))
			.orderBy(formFieldsTable.index);

		if (!rows || rows.length === 0) {
			return null;
		}

		const form = rows[0]!;
		const fields = rows
			.filter((row) => !!row.fieldId)
			.map((row) => ({
				id: row.fieldId!,
				label: row.label!,
				labelKey: row.labelKey!,
				description: row.fieldDescription ?? null,
				placeholder: row.placeholder ?? null,
				isRequired: !!row.isRequired,
				index: String(row.index as unknown as string | number),
				type: row.type!,
				formId: row.fieldFormId!,
				configuration: row.configuration ?? null,
				createdAt: row.fieldCreatedAt ? (row.fieldCreatedAt as Date).toISOString() : null,
				updatedAt: row.fieldUpdatedAt ? (row.fieldUpdatedAt as Date).toISOString() : null,
			}));

		return {
			id: form.formId,
			title: form.title,
			description: form.description,
			acceptsResponses: !!form.acceptsResponses,
			createdBy: form.createdBy,
			createdAt: form.createdAt ? (form.createdAt as Date).toISOString() : null,
			updatedAt: form.updatedAt ? (form.updatedAt as Date).toISOString() : null,
			fields,
		};
	}

	public async updateResponsesStatus(formId: string, acceptsResponses: boolean) {
		if (!formId) throw new Error('formId is required');

		const updated = await db
			.update(formsTable)
			.set({ acceptsResponses, updatedAt: new Date() })
			.where(eq(formsTable.id, formId))
			.returning({ id: formsTable.id, acceptsResponses: formsTable.acceptsResponses });

		if (!updated[0]?.id) {
			throw new Error('Failed to update form responses status');
		}

		return updated[0];
	}

	public async deleteForm(formId: string) {
		if (!formId) throw new Error('formId is required');

		// 1. Delete submissions first
		await db.delete(formSubmissionTable).where(eq(formSubmissionTable.formId, formId));

		// 2. Delete form fields next
		await db.delete(formFieldsTable).where(eq(formFieldsTable.formId, formId));

		// 3. Delete the form itself
		const deleted = await db
			.delete(formsTable)
			.where(eq(formsTable.id, formId))
			.returning({ id: formsTable.id });

		if (!deleted[0]?.id) {
			throw new Error('Failed to delete form');
		}

		return deleted[0];
	}
}

export default FormService;
