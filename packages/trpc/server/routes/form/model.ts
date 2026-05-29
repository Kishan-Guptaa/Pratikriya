import { z } from 'zod';
import { getFieldOutputModel } from '../form-field/model';

export const createFormInputModel = z.object({
	title: z.string().min(1).max(55).describe('The title of the form'),
	description: z.string().max(300).optional().nullable().describe('Optional description for the form'),
});

export const createFormOutputModel = z.object({
	id: z.string().describe('The unique identifier of the form'),
});

export const updateFormResponsesStatusInputModel = z.object({
	formId: z.string().uuid().describe('The unique identifier of the form'),
	acceptsResponses: z.boolean().describe('Whether the form should accept responses'),
});

export const updateFormResponsesStatusOutputModel = z.object({
	id: z.string().describe('The unique identifier of the form'),
	acceptsResponses: z.boolean().describe('Whether the form accepts responses'),
});

export const getFormByFormIdInputModel = z.object({
	formId: z.string().uuid().describe('The unique identifier of the form'),
});

export const getFormByFormIdOutputModel = z.object({
	id: z.string().describe('The unique identifier of the form'),
	title: z.string().describe('Form title'),
	description: z.string().max(300).optional().nullable().describe('Optional description'),
	acceptsResponses: z.boolean().describe('Whether the form is accepting responses'),
	createdBy: z.string().uuid().optional().nullable().describe('User id who created the form'),
	createdAt: z.string().describe('ISO timestamp when the form was created'),
	updatedAt: z.string().describe('ISO timestamp when the form was last updated'),
	fields: z.array(getFieldOutputModel).describe('Fields belonging to the form'),
});

export const listFormsOutputModel = z.array(
	z.object({
		id: z.string().describe('The unique identifier of the form'),
		title: z.string().describe('Form title'),
		description: z.string().max(300).optional().nullable().describe('Optional description'),
		acceptsResponses: z.boolean().describe('Whether the form is accepting responses'),
		createdBy: z.string().uuid().optional().nullable().describe('User id who created the form'),
		createdAt: z.string().describe('ISO timestamp when the form was created'),
		updatedAt: z.string().describe('ISO timestamp when the form was last updated'),
	})
);
