import { UIDialog } from '@/ui/components';

export type ChatAction = {
  id: string;
  label: string;
  destructive?: boolean;
  onSelect: () => void;
};

/** The web stand-in for the app's native context menu: a bottom sheet of actions. */
export function ChatActionSheet({
  open,
  onOpenChange,
  title,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  actions: ChatAction[];
}) {
  return (
    <UIDialog
      open={open}
      onOpenChange={onOpenChange}
      placement="bottom"
      title={title}
      className="max-lg:rounded-t-feature max-lg:px-4 max-lg:[&>h2]:sr-only"
    >
      <ul className="mt-2 flex flex-col overflow-hidden rounded-2xl border border-white-10 bg-white-5">
        {actions.map(({ id, label, destructive, onSelect }) => (
          <li key={id} className="border-b border-white-5 last:border-b-0">
            <button
              type="button"
              data-ph-capture-attribute-label={`Message menu ${id}`}
              onClick={() => {
                onOpenChange(false);
                onSelect();
              }}
              className={`w-full px-4 py-3.5 text-left text-base font-medium focus-visible:outline-2 focus-visible:outline-blue active:bg-white-10 ${destructive ? 'text-red' : 'text-white'}`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </UIDialog>
  );
}
