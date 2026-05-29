"use client";

import { trpc } from '~/trpc/client';

export const useCreateSubmission = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.formSubmission.createSubmission.useMutation({
    onSuccess: async (_, variables) => {
      try {
        await utils.form.getFormByFormId.invalidate({ formId: variables.formId });
      } catch {
        // ignore cache errors
      }
    },
  });

  return {
    createSubmissionAsync: mutation.mutateAsync,
    createSubmission: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export const useListAllSubmissionsForUser = () => {
  const query = trpc.formSubmission.listAllSubmissionsForUser.useQuery(undefined, {
    staleTime: 1000 * 30,
  });

  return {
    submissions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};