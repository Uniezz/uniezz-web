import { useTranslation } from 'react-i18next';
import { Skeleton } from 'skullet/react';

import { ChatBubble } from './ChatBubble';
import { ChatMessageRow } from './ChatMessageRow';

const sampleRows = [
  { outgoing: false, text: 'Hi! Are you at the library?' },
  { outgoing: true, text: 'Yes, second floor' },
  { outgoing: false, text: 'Great, I will be there in ten minutes' },
  { outgoing: true, text: 'See you soon' },
];

/** Sample bubbles that only give the skeleton its shape. Extra rows are cut off at the top, as in a full thread. */
export function ChatThreadSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="grid min-h-0 flex-1 content-end overflow-hidden">
      <Skeleton loading label={t('apiState.loading')}>
        <div inert>
          {Array.from({ length: 20 }, (_, index) => {
            const { outgoing, text } = sampleRows[index % sampleRows.length];
            return (
              <ChatMessageRow key={index} role="presentation" align={outgoing ? 'end' : 'start'}>
                <ChatBubble variant={outgoing ? 'out' : 'in'} tail meta="00:00">
                  <p>{text}</p>
                </ChatBubble>
              </ChatMessageRow>
            );
          })}
        </div>
      </Skeleton>
    </div>
  );
}
