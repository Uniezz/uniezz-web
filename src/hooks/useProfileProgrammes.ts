import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Programme } from '@/@types';
import { deleteProgramme, listMyProgrammes, saveProgramme as saveProgrammeApi } from '@/api';
import type { ProgrammeFormSchema } from '@/schemas';

type SaveProgrammeVariables = {
  programme: ProgrammeFormSchema;
  id?: string;
};

export function useMyProgrammes() {
  return useQuery({
    queryKey: ['profile', 'programmes'],
    queryFn: listMyProgrammes,
  });
}

export function useProfileProgrammes() {
  const queryClient = useQueryClient();
  const { mutateAsync: saveProgramme, isPending: isSaving } = useMutation({
    meta: { analyticsAction: 'programme_save' },
    mutationKey: ['profile', 'programmes', 'save'],
    mutationFn: ({ programme, id }: SaveProgrammeVariables) =>
      saveProgrammeApi(
        {
          programme: programme.programme,
          faculty: programme.faculty,
          isPrimary: programme.isPrimary,
          status: programme.status,
          level: programme.level ?? undefined,
          modeOfStudies: programme.modeOfStudies ?? undefined,
          yearOfStudy: programme.yearOfStudy ?? undefined,
        },
        id ?? programme.id,
      ),
    onSuccess: (saved) => {
      queryClient.setQueryData<Programme[]>(['profile', 'programmes'], (programmes) => {
        if (!programmes) return programmes;
        const updated = programmes.map((item) => (item.id === saved.id ? saved : item));
        if (!updated.some((item) => item.id === saved.id)) {
          updated.push(saved);
        }
        return saved.isPrimary
          ? [saved, ...updated.map((item) => ({ ...item, isPrimary: false }))]
          : updated;
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'programmes'] });
      void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
  const { mutateAsync: removeProgramme, isPending: isRemoving } = useMutation({
    meta: { analyticsAction: 'programme_delete' },
    mutationKey: ['profile', 'programmes', 'delete'],
    mutationFn: deleteProgramme,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Programme[]>(['profile', 'programmes'], (programmes) =>
        programmes ? programmes.filter((item) => item.id !== id) : programmes,
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'programmes'] });
      void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
  return {
    saveProgramme,
    isSaving,
    removeProgramme,
    isRemoving,
  };
}
