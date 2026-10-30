import { useState } from 'react';
import { Download, FileText, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Material } from '@/@types';
import { UIButton, UIDialog, UIEmpty, UIPanel } from '@/ui/components';

export function MaterialTable({
  rows,
  emptyCategory,
}: {
  rows: Material[];
  emptyCategory: boolean;
}) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<Material | null>(null);
  const headers = [
    t('app.subject'),
    t('app.type'),
    t('app.uploadedBy'),
    t('app.rating'),
    t('app.downloads'),
    t('app.download'),
  ];
  const columnWidths = ['40%', '12%', '18%', '12%', '10%', '8%'];
  return (
    <>
      <UIPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
        {emptyCategory ? (
          <UIEmpty />
        ) : (
          <>
            <table className="w-full min-w-[760px] text-left text-body">
              <colgroup>
                {columnWidths.map((width) => (
                  <col key={width} style={{ width }} />
                ))}
              </colgroup>
              <thead className="text-detail font-medium text-secondary">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="px-4 py-3 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            <div className="scrollbar-gray min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[760px] text-left text-body">
                <colgroup>
                  {columnWidths.map((width) => (
                    <col key={width} style={{ width }} />
                  ))}
                </colgroup>
                <tbody>
                  {rows.map((m, i) => (
                    <tr
                      key={`${m.subject}-${i}`}
                      className={`border-t border-white-5 ${m.subject.startsWith('Thermodynamics') ? 'bg-white-5' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="shrink-0 text-secondary" />
                          <div>
                            <span className="font-semibold">{m.subject}</span>
                            {i === 0 && !m.own && (
                              <span className="app-tag ml-2 text-sky">{t('app.trending')}</span>
                            )}
                            <p className="mt-1 text-detail font-medium text-secondary">
                              {m.university}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-label text-white-80">{m.type}</td>
                      <td className="px-4 py-3 text-label text-white-80">{m.author}</td>
                      <td className="px-4 py-3 text-label font-semibold">
                        <Star size={12} className="mr-1 inline fill-warning text-warning" />
                        {m.rating} <span className="text-muted">({m.votes})</span>
                      </td>
                      <td className="px-4 py-3 text-label text-white-80">{m.downloads}</td>
                      <td className="px-4 py-3">
                        <UIButton
                          size="icon"
                          bg="secondary"
                          aria-label={`${t('app.download')} ${m.subject}`}
                          onClick={() => setDetail(m)}
                        >
                          <Download size={15} />
                        </UIButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <UIEmpty />}
            </div>
          </>
        )}
      </UIPanel>
      {detail && (
        <UIDialog
          open
          onOpenChange={() => setDetail(null)}
          title={detail.subject}
          description={`${detail.university} · ${detail.type} · ${detail.author}`}
        >
          <p className="text-label text-secondary">{t('app.noDocument')}</p>
        </UIDialog>
      )}
    </>
  );
}
