import { authenticatedProcedure, publicProcedure, router } from '../../trpc';
import { generatePath } from '../../utils/path-generator';
import { formService } from '../../services';
import {
	createFormInputModel,
	createFormOutputModel,
	getFormByFormIdInputModel,
	getFormByFormIdOutputModel,
	listFormsOutputModel,
	updateFormResponsesStatusInputModel,
	updateFormResponsesStatusOutputModel,
} from './model';
import { z } from 'zod';

const TAGS = ['Form'];
const getPath = generatePath('/form');

export const formRouter = router({
	getFormByFormId: publicProcedure.meta({
		openapi: {
			method: 'GET',
			path: getPath('/getFormByFormId'),
			tags: TAGS,
		},
	})
		.input(getFormByFormIdInputModel)
		.output(getFormByFormIdOutputModel.nullable())
		.query(async ({ input }) => {
			const form = await formService.getFormByFormId(input.formId);
			return form as any;
		}),

	createForm: authenticatedProcedure.meta({
		openapi: {
			method: 'POST',
			path: getPath('/createForm'),
			tags: TAGS,
            protect: true
		},
	})
		.input(createFormInputModel)
		.output(createFormOutputModel)
		.mutation(async ({ input, ctx }) => {
			const { title, description } = input;
			const { id } = await formService.createForm({
				title,
				description,
				createdBy: ctx.user.id,
			});

			return { id };
		}),

		listByUser: authenticatedProcedure.meta({
			openapi: {
				method: 'GET',
				path: getPath('/listByUser'),
				tags: TAGS,
				protect: true,
			},
		})
			.input(z.undefined())
			.output(listFormsOutputModel)
			.query(async ({ ctx }) => {
				const forms = await formService.listFormsByUserId(ctx.user.id);
				return forms as any;
			}),

		updateResponsesStatus: authenticatedProcedure.meta({
			openapi: {
				method: 'POST',
				path: getPath('/updateResponsesStatus'),
				tags: TAGS,
				protect: true,
			},
		})
			.input(updateFormResponsesStatusInputModel)
			.output(updateFormResponsesStatusOutputModel)
			.mutation(async ({ input, ctx }) => {
				const form = await formService.getFormByFormId(input.formId);

				if (!form) {
					throw new Error('Form not found');
				}

				if (form.createdBy !== ctx.user.id) {
					throw new Error('You are not allowed to update this form');
				}

				const updatedForm = await formService.updateResponsesStatus(input.formId, input.acceptsResponses);
				return updatedForm as any;
			}),

	deleteForm: authenticatedProcedure.meta({
		openapi: {
			method: 'POST',
			path: getPath('/deleteForm'),
			tags: TAGS,
			protect: true,
		},
	})
		.input(z.object({ formId: z.string().uuid() }))
		.output(z.object({ id: z.string().uuid() }))
		.mutation(async ({ input, ctx }) => {
			const form = await formService.getFormByFormId(input.formId);

			if (!form) {
				throw new Error('Form not found');
			}

			if (form.createdBy !== ctx.user.id) {
				throw new Error('You are not allowed to delete this form');
			}

			const deletedForm = await formService.deleteForm(input.formId);
			return deletedForm;
		}),
});