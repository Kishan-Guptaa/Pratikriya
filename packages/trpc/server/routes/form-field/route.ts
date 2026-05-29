import { authenticatedProcedure, router } from '../../trpc';
import { generatePath } from '../../utils/path-generator';
import { formFieldService } from '../../services';
import * as models from './model';

const TAGS = models.TAGS;
const getPath = generatePath('/form-field');

export const formFieldRouter = router({
  createField: authenticatedProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/createField'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.createFieldInputModel)
    .output(models.createFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.createField(input as any);
      return { id };
    }),

  updateField: authenticatedProcedure.meta({
    openapi: {
      method: 'PUT',
      path: getPath('/updateField'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.updateFieldInputModel)
    .output(models.updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.updateField(input as any);
      return { id };
    }),

  deleteField: authenticatedProcedure.meta({
    openapi: {
      method: 'DELETE',
      path: getPath('/deleteField'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.deleteFieldInputModel)
    .output(models.deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.deleteField(input as any);
      return { id };
    }),

  getNextIndex: authenticatedProcedure.meta({
    openapi: {
      method: 'GET',
      path: getPath('/getNextIndex'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.getNextIndexInputModel)
    .output(models.getNextIndexOutputModel)
    .query(async ({ input }) => {
      const idx = await formFieldService.getNextIndex(input.formId);
      return { index: idx };
    }),

  getField: authenticatedProcedure.meta({
    openapi: {
      method: 'GET',
      path: getPath('/getField'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.getFieldInputModel)
    .output(models.getFieldOutputModel.optional())
    .query(async ({ input }) => {
      const fld = await formFieldService.getField(input.id);
      return fld as any;
    }),

  listByFormId: authenticatedProcedure.meta({
    openapi: {
      method: 'GET',
      path: getPath('/listByFormId'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.listFieldsByFormIdInputModel)
    .output(models.listFieldsByFormIdOutputModel)
    .query(async ({ input }) => {
      const fields = await formFieldService.listByFormId(input.formId);
      return fields as any;
    }),

  reorderFields: authenticatedProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/reorderFields'),
      tags: TAGS,
      protect: true,
    },
  })
    .input(models.reorderFieldsInputModel)
    .output(models.reorderFieldsOutputModel)
    .mutation(async ({ input }) => {
      const res = await formFieldService.reorderFields(input as any);
      return res;
    }),
});

