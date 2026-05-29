"use client";

import { trpc } from '~/trpc/client';

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.listByUser.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useUpdateFormResponsesStatus = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.form.updateResponsesStatus.useMutation({
    onSuccess: async (_, variables) => {
      await Promise.all([
        utils.form.listByUser.invalidate(),
        utils.form.getFormByFormId.invalidate({ formId: variables.formId }),
      ]);
    },
  });

  return {
    updateFormResponsesStatusAsync: mutation.mutateAsync,
    updateFormResponsesStatus: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export const useGetForms = () => {
  const query = trpc.form.listByUser.useQuery(undefined, {
    staleTime: 1000 * 60, // 1 minute cache
  });

  return {
    forms: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetFormByFormId = (formId: string | undefined) => {
  const query = trpc.form.getFormByFormId.useQuery(
    { formId: formId as string },
    {
      enabled: !!formId,
      staleTime: 1000 * 30,
    }
  );

  return {
    form: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetFormSubmissionsByFormId = (formId: string | undefined) => {
  const query = trpc.formSubmission.getFormSubmissionsByFormId.useQuery(
    { formId: formId as string },
    {
      enabled: !!formId,
      staleTime: 1000 * 30,
    }
  );

  return {
    submissions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.form.deleteForm.useMutation({
    onSuccess: async () => {
      await utils.form.listByUser.invalidate();
    },
  });

  return {
    deleteFormAsync: mutation.mutateAsync,
    deleteForm: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useCreateForm;
