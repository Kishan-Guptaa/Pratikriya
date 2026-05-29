"use client";

import { trpc } from '~/trpc/client';

export const useCreateField = () => {
  const utils = trpc.useUtils();
  const { mutateAsync: createFieldAsync, mutate: createField, ...rest } = trpc.formField.createField.useMutation({
    onSuccess: async (data) => {
      try {
        await utils.form.listByUser.invalidate();
        await utils.formField.getField.invalidate({ id: data.id });
        await utils.formField.listByFormId.invalidate();
        await utils.formField.getNextIndex.invalidate();
      } catch (e) {
        // ignore
      }
    },
  });

  return {
    createFieldAsync,
    createField,
    ...rest,
  };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();
  const { mutateAsync: updateFieldAsync, mutate: updateField, ...rest } = trpc.formField.updateField.useMutation({
    onSuccess: async (data) => {
      try {
        await utils.form.listByUser.invalidate();
        await utils.formField.getField.invalidate({ id: data.id });
        await utils.formField.listByFormId.invalidate();
        await utils.formField.getNextIndex.invalidate();
      } catch (e) {}
    },
  });

  return {
    updateFieldAsync,
    updateField,
    ...rest,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();
  const { mutateAsync: deleteFieldAsync, mutate: deleteField, ...rest } = trpc.formField.deleteField.useMutation({
    onSuccess: async (data) => {
      try {
        await utils.form.listByUser.invalidate();
        await utils.formField.getField.invalidate({ id: data.id });
        await utils.formField.listByFormId.invalidate();
        await utils.formField.getNextIndex.invalidate();
      } catch (e) {}
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    ...rest,
  };
};

export const useGetNextIndex = (formId: string | undefined) => {
  const query = trpc.formField.getNextIndex.useQuery(
    { formId: formId as string },
    {
      enabled: !!formId,
      staleTime: 1000 * 30,
    }
  );

  return {
    index: query.data?.index,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetField = (id: string | undefined) => {
  const query = trpc.formField.getField.useQuery(
    { id: id as string },
    {
      enabled: !!id,
      staleTime: 1000 * 60,
    }
  );

  return {
    field: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useListFieldsByFormId = (formId: string | undefined) => {
  const query = trpc.formField.listByFormId.useQuery(
    { formId: formId as string },
    {
      enabled: !!formId,
      staleTime: 1000 * 30,
    }
  );

  return {
    fields: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useReorderFields = () => {
  const utils = trpc.useUtils();
  const { mutateAsync: reorderFieldsAsync, mutate: reorderFields, ...rest } = trpc.formField.reorderFields.useMutation({
    onSuccess: async () => {
      try {
        await utils.formField.listByFormId.invalidate();
      } catch (e) {}
    },
  });

  return {
    reorderFieldsAsync,
    reorderFields,
    ...rest,
  };
};

export default useCreateField;

