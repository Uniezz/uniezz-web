import { useState } from 'react';

import type { ChatMessageView } from '@/@types';

/** Which message the report dialog and the delete dialog are open for. Null means closed. */
export function useChatMessageDialogs() {
  const [messageToReport, setMessageToReport] = useState<ChatMessageView | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ChatMessageView | null>(null);

  return {
    messageToReport,
    messageToDelete,
    openReport: setMessageToReport,
    openDelete: setMessageToDelete,
    closeReport: () => setMessageToReport(null),
    closeDelete: () => setMessageToDelete(null),
  };
}
