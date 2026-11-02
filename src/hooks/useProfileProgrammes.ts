import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/@types/schema';
import { deleteProgramme, saveProgramme as saveProgrammeApi } from '@/api';
import type { ProgrammeFormSchema } from '@/schemas';

type SaveProgrammeVariables = {
  programme: ProgrammeFormSchema;
  id?: string;
};

export function useProfileProgrammes() {
  const queryClient = useQueryClient();
  const { mutateAsync: saveProgramme, isPending: isSaving } = useMutation({
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
      queryClient.setQueryData<components['schemas']['Profile']>(['profile', 'me'], (profile) => {
        if (!profile) return profile;
        const programmes = (profile.programmes ?? []).filter((item) => item.id !== saved.id);
        const updated = profile.programmes?.some((item) => item.id === saved.id)
          ? (profile.programmes ?? []).map((item) => (item.id === saved.id ? saved : item))
          : [...(profile.programmes ?? []), saved];
        return {
          ...profile,
          programmes: saved.isPrimary
            ? [saved, ...programmes.map((item) => ({ ...item, isPrimary: false }))]
            : updated,
        };
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
  const { mutateAsync: removeProgramme, isPending: isRemoving } = useMutation({
    mutationKey: ['profile', 'programmes', 'delete'],
    mutationFn: deleteProgramme,
    onSuccess: (_, id) => {
      queryClient.setQueryData<components['schemas']['Profile']>(['profile', 'me'], (profile) =>
        profile
          ? { ...profile, programmes: (profile.programmes ?? []).filter((item) => item.id !== id) }
          : profile,
      );
    },
    onSettled: () => {
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
