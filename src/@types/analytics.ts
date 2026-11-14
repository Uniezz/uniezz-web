import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    // progress: loading toast text while the request runs; omit for instant toggles.
    mutationMeta: { analyticsAction: string; progress?: () => string };
  }
}
