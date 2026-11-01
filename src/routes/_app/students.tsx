import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { StudentSearchResults } from '@/components/features/connections/StudentSearchResults';
import { UITopbar } from '@/ui/components';
import { optionalSearchStringSchema } from '@/schemas';

export const Route = createFileRoute('/_app/students')({
  validateSearch: (search: Record<string, unknown>) => ({
    studentSearch: optionalSearchStringSchema.parse(search.studentSearch),
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { t } = useTranslation();
  const { studentSearch = '' } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [typedSearch, setTypedSearch] = useState(studentSearch);
  const [debouncedName, setDebouncedName] = useState(studentSearch.trim());
  const updateName = useMemo(() => debounce(setDebouncedName, 300), []);
  useEffect(() => () => updateName.cancel(), [updateName]);
  const name = studentSearch === typedSearch ? debouncedName : studentSearch.trim();

  return (
    <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col overflow-hidden lg:h-[calc(100svh-56px)]">
      <div className="shrink-0">
        <Link
          to="/connections"
          className="mb-4 inline-flex min-h-11 items-center gap-2 text-label text-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-blue"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          {t('connections.title')}
        </Link>
        <UITopbar
          title={t('students.allStudents')}
          search={{
            value: studentSearch,
            onChange: (value) => {
              const nextSearch = value.slice(0, 120);
              setTypedSearch(nextSearch);
              updateName(nextSearch.trim());
              void navigate({
                search: (previous) => ({ ...previous, studentSearch: nextSearch }),
                replace: true,
              });
            },
            label: t('students.search'),
          }}
        />
      </div>
      <div className="min-h-0 flex-1">
        <StudentSearchResults search={studentSearch} name={name} />
      </div>
    </div>
  );
}
