// ai-design-check-ignore-file use-shared-components -- UIField and app-control are the established shared form pattern for react-hook-form in this project.
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import type { Course } from '@/@types';
import { useCreateCourse, useUpdateCourse, useUniversities, useMyProfile } from '@/hooks';
import { createCourseSchema, type CreateCourseForm } from '@/schemas';
import { captureAnalytics } from '@/utils/analytics';
import { UIButton, UIDialog, UIField } from '@/ui/components';

export function CourseFormDialog({ course, onClose }: { course?: Course; onClose: () => void }) {
  const { t } = useTranslation();
  const { data: universities = [] } = useUniversities();
  const { data: me } = useMyProfile();
  const { mutateAsync: create, isPending: isCreating } = useCreateCourse();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateCourse();
  const isPending = isCreating || isUpdating;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: course ?? {
      name: '',
      description: '',
      universityId: me?.universityId ?? '',
      faculty: '',
      subject: '',
      semester: 1,
      difficulty: 3,
    },
  });
  async function submit(values: CreateCourseForm) {
    try {
      if (course) {
        await update({
          id: course.id,
          body: {
            name: values.name,
            description: values.description,
            difficulty: values.difficulty,
          },
        });
      } else {
        await create(values);
      }
      toast.success(t('courses.saved'));
      onClose();
    } catch {
      toast.error(t('apiState.error'));
    }
  }
  return (
    <UIDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      dismissible={!isPending}
      title={t(course ? 'courses.edit' : 'courses.create')}
      description={t('courses.formDescription')}
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(submit, () => captureAnalytics('course_form_validation_failed'))}
      >
        <fieldset disabled={isPending} className="space-y-4">
          <UIField
            label={t('courses.name')}
            error={errors.name ? t('courses.nameHint') : undefined}
          >
            <input
              className="app-control"
              autoComplete="off"
              maxLength={150}
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </UIField>
          <UIField
            label={t('courses.description')}
            error={errors.description ? t('courses.descriptionHint') : undefined}
          >
            <textarea
              className="app-control min-h-28 resize-y"
              maxLength={5000}
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </UIField>
          <UIField
            label={t('courses.difficulty')}
            error={errors.difficulty ? t('courses.difficultyHint') : undefined}
          >
            <input
              type="number"
              className="app-control"
              min={1}
              max={5}
              step={1}
              {...register('difficulty', { valueAsNumber: true })}
            />
          </UIField>
          {!course && (
            <>
              <UIField
                label={t('app.university')}
                error={errors.universityId ? t('app.required') : undefined}
              >
                <select className="app-control" {...register('universityId')}>
                  <option value="">{t('courses.chooseUniversity')}</option>
                  {universities.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </UIField>
              <UIField
                label={t('app.faculty')}
                error={errors.faculty ? t('courses.nameHint') : undefined}
              >
                <input className="app-control" maxLength={150} {...register('faculty')} />
              </UIField>
              <UIField
                label={t('app.subject')}
                error={errors.subject ? t('courses.nameHint') : undefined}
              >
                <input className="app-control" maxLength={150} {...register('subject')} />
              </UIField>
              <UIField
                label={t('app.semester')}
                error={errors.semester ? t('courses.semesterHint') : undefined}
              >
                <input
                  className="app-control"
                  type="number"
                  min={1}
                  max={10}
                  step={1}
                  {...register('semester', { valueAsNumber: true })}
                />
              </UIField>
            </>
          )}
        </fieldset>
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={onClose} disabled={isPending}>
            {t('app.cancel')}
          </UIButton>
          <UIButton type="submit" disabled={isPending || (course && !course.isMine)}>
            {t('app.save')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
