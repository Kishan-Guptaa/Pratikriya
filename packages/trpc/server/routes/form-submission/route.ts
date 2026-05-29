import { publicProcedure, authenticatedProcedure, router } from '../../trpc';
import { generatePath } from '../../utils/path-generator';
import { formSubmissionService, formService } from '../../services';
import { z } from 'zod';
import * as models from './model';

const getPath = generatePath('/form-submission');
const TAGS = models.TAGS;

export const formSubmissionRouter = router({
  createSubmission: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/createSubmission'),
      tags: TAGS,
      protect: false,
    },
  })
    .input(models.createSubmissionInputModel)
    .output(models.createSubmissionOutputModel)
    .mutation(async ({ input }) => {
      const form = await formService.getFormByFormId(input.formId);

      if (!form) {
        throw new Error('Form not found');
      }

      if (!form.acceptsResponses) {
        throw new Error('This form is no longer accepting responses. Please contact the form owner.');
      }

      const result = await formSubmissionService.createSubmission(input as any);
      return result;
    }),

  getFormSubmissionsByFormId: authenticatedProcedure.meta({
    openapi: {
      method: 'GET',
      path: getPath('/getFormSubmissionsByFormId'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.listSubmissionsByFormIdInputModel)
    .output(models.listSubmissionsByFormIdOutputModel)
    .query(async ({ input, ctx }) => {
      const form = await formService.getFormByFormId(input.formId);

      if (!form) {
        return [];
      }

      if (form.createdBy !== ctx.user.id) {
        throw new Error('You are not allowed to view submissions for this form');
      }

      const submissions = await formSubmissionService.getFormSubmissionsByFormId(input.formId);
      return submissions as any;
    }),

  listSubmissionsByFormId: authenticatedProcedure.meta({
    openapi: {
      method: 'GET',
      path: getPath('/listSubmissionsByFormId'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.listSubmissionsByFormIdInputModel)
    .output(models.listSubmissionsByFormIdOutputModel)
    .query(async ({ input }) => {
      const submissions = await formSubmissionService.listByFormId(input.formId);
      return submissions as any;
    }),

  listAllSubmissionsForUser: authenticatedProcedure.meta({
    openapi: {
      method: 'GET',
      path: getPath('/listAllSubmissionsForUser'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(z.undefined())
    .output(models.listSubmissionsByFormIdOutputModel)
    .query(async ({ ctx }) => {
      const submissions = await formSubmissionService.listAllForUser(ctx.user.id);
      return submissions as any;
    }),
});