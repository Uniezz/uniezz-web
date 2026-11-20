# Uniezz — Chat design

Last edited: 2026-11-18

## Purpose

Chat is where a match, a post or a study group becomes a real conversation. The screen has one job: help two or more students talk fast and feel safe doing it.

This document describes the redesign of the web chat. It covers what exists today, the design direction, every feature with its states, and what the backend must provide. It is a design spec only.

## What exists today

| Area                                                                                                                          | Status                             | Where                                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------- |
| Conversation list with search                                                                                                 | Done (client-side)                 | `ConversationList.tsx`                              |
| Filter All / Groups / Connections                                                                                             | Done                               | `ConversationList.tsx`                              |
| Unread badge in list                                                                                                          | Done (mock data)                   | `route.tsx`                                         |
| Thread with text bubbles and time                                                                                             | Done (mock data)                   | `ChatThread.tsx`                                    |
| Composer: Enter to send, emoji, auto-grow, 4000 chars                                                                         | Done                               | `ChatThread.tsx`                                    |
| Attachments: up to 5, image collage, lightbox, file chip                                                                      | Done                               | `ChatDraftAttachments.tsx`, `ChatMessageImages.tsx` |
| Create group                                                                                                                  | Done                               | `CreateGroup.tsx`                                   |
| Start a chat from a connection                                                                                                | Done (real connections hook)       | `ConnectionsList.tsx`                               |
| Mobile one-panel flow                                                                                                         | Done                               | `route.tsx`                                         |
| Empty states                                                                                                                  | Done                               | `UIEmpty`                                           |
| Typing line, post card, online status                                                                                         | Mock only (hardcoded for one chat) | `ChatThread.tsx`                                    |
| Realtime, delivery status, reactions, reply, edit, delete, pin, mute, search in chat, date separators, sender names in groups | Missing                            | —                                                   |

The backend has no chat endpoints yet. The only chat-related capability is `upload kind=chat` (images only, 10 MB).

## Design direction

Keep the Uniezz look: dark glass panels (24px radius), blue `#5B7CFF` for outgoing messages, white 10% for incoming, Geist type, pill controls. Chat must feel like the Feed and Connections screens, not like a different app.

What changes is how alive it feels.

1. **Grouped bubbles.** Messages from the same person in a row form one group. Only the last bubble of a group has the small tail corner. Only that bubble shows the avatar in groups.
2. **Context card (the signature).** A chat can start from a post: housing, a course, notes. A card under the header shows the post and its live state, for example "Room still available". When the user scrolls, it shrinks into a one-line chip. This ties chat to what makes Uniezz different from a generic messenger.
3. **Hover action bar.** Hovering a message shows three quick actions: react, reply, more. Right-click on a message opens the same menu, and a visible "More" button does too (for touch screens and keyboard users).
4. **Reactions as small pills** under the bubble. A reaction you added has a blue ring.
5. **Visible status.** Every sent message shows its state. Nothing fails silently.
6. **Calm motion.** Existing `rise-in` for new bubbles, `pop-in` for reactions and menus, three soft dots for typing. Everything uses `motion-safe:`.

Rule: one bold idea (context card). Everything else stays quiet and uses existing tokens and components.

## Features

### P0 — core, replaces the mock

| Feature              | What the user sees                                                                                                    | Behavior and states                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Realtime messages    | New messages appear without reload                                                                                    | WebSocket or similar. On disconnect show the offline banner. A send that fails shows a toast and the text stays in the message field |
| Typing indicator     | Three dots bubble with name in groups                                                                                 | Shows after 1 s of typing, hides after 5 s idle                                                                                      |
| Presence             | Green dot on avatar, "Online" or "Last seen 14:20" in header                                                          | User can hide last seen later (privacy setting)                                                                                      |
| Message status       | Clock = sending, one check = sent, two checks = delivered, blue two checks = seen. In groups: tiny avatars of readers | A failed send shows a toast and keeps the text as a draft (no failed bubble)                                                         |
| Date separators      | Centered chip: Today, Yesterday, 12 Nov                                                                               | Sticky while scrolling                                                                                                               |
| New messages divider | Line with "3 new messages" at the first unread                                                                        | Disappears after the user reads or leaves                                                                                            |
| Grouped bubbles      | See design direction                                                                                                  | Group breaks after 5 minutes or a sender change                                                                                      |
| Group sender         | Name above first bubble of a group, color per member                                                                  | Color is stable per member                                                                                                           |
| Unread               | Count badge in list and in sidebar item                                                                               | Clears on opening thread. Sidebar badge is FE-3.9                                                                                    |
| Jump to latest       | Round button with unread count, bottom right of thread                                                                | Shows when user is scrolled up more than one screen                                                                                  |
| Loading              | Skeleton rows in list, skeleton bubbles in thread                                                                     | No spinner-only screens                                                                                                              |
| Empty                | Cat from `UIEmpty` with a clear action: "Say hi"                                                                      | Different copy for no chats, no results, empty thread                                                                                |
| Error                | Inline error with "Try again"                                                                                         | Per list and per thread, never a blank panel                                                                                         |
| Offline              | Banner at top of thread: "You are offline. Check your connection."                                                    | A send while offline fails: toast, text stays in the field as a draft                                                                |

### P1 — interactive

| Feature                   | What the user sees                                                                                | Behavior and states                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reply                     | Quote block on top of the bubble. Preview bar above the composer with close X                     | Tap on quote scrolls to the original and flashes it                                                                                              |
| Reactions                 | 6 quick emojis on hover, plus "more" opens the picker (`UIEmojiPicker`)                           | One reaction per user per message. Tap own reaction to remove                                                                                    |
| Message menu              | Reply, Copy, Edit, Pin, Report, Delete                                                            | Edit only own messages, within 15 minutes. Shows "edited" label                                                                                  |
| Delete                    | Confirm dialog: Delete for me / Delete for everyone                                               | "Everyone" leaves a "Message deleted" placeholder                                                                                                |
| Context card              | Post thumbnail, title, state chip, "Open post"                                                    | Hidden if the chat has no post. Collapses on scroll                                                                                              |
| Pin / mute / archive chat | Pin icon and muted bell in list row. Right-click menu and a "More" button on the web              | Pinned chats stay at the top, max 3                                                                                                              |
| Search in chat            | Search icon in header opens a bar with result count and up/down arrows                            | Highlights matches in bubbles                                                                                                                    |
| Message requests          | Requests filter shows chats from people not in connections. Bottom bar: Accept / Decline / Report | Composer is locked until accepted                                                                                                                |
| Link preview              | Small card under a bubble with image, title, domain                                               | Only for http(s). Fetched by backend                                                                                                             |
| Mentions                  | Type @ to open a member list. Mention is blue in the bubble                                       | Groups only. Mentioned user gets a stronger notification                                                                                         |
| Group info panel          | Right panel: members, media, files, links, leave group                                            | Opens from the header. On mobile it is a full sheet. Only the owner sees the "Edit" button (name, photo, description). Admins and members do not |
| Attachments               | Existing behavior (see "What exists today")                                                       | Add upload progress ring on each draft                                                                                                           |

### P2 — also in scope

These features are part of the release too. They come after P0 and P1 in build order, because they need more backend work or are less urgent. Each one is drawn in frame `05h · Chat · More features`.

| Idea                | What it means                                                   | How it works                                                                                                                                                                                           | Useful when                                                                 |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Voice notes         | Send a short audio message instead of typing                    | Hold the mic to record, slide left to cancel, tap to lock. Bubble shows play button, waveform, length and a 1x / 1.5x / 2x speed chip. Needs audio upload (backend accepts images only today)          | Typing is slow, for example on a bus                                        |
| Pinned messages bar | Important messages stay at the top of the chat                  | Owner and admins can pin, up to 3. The bar shows "Pinned · 1 of 3" and the text. Tap to jump to the original. Tap the pin icon to see the next one                                                     | A group needs a lab time or room number that people ask for again and again |
| Drafts per chat     | Unsent text is saved for each chat                              | The list row shows a red "Draft:" label and the text. Opening the chat restores the text in the composer. Cleared after send                                                                           | You switch chats and want to finish your answer later                       |
| Polls               | A member asks a question with 2 to 6 options and everyone votes | One vote per person (can be changed until the poll ends). Bars and percents update live. Footer shows voter avatars, vote count and time left. The creator can close the poll                          | A group must choose a place or a time                                       |
| Forward message     | Send a message to another chat                                  | Opens a picker with search and checkboxes. Up to 5 chats at once. The copy shows a small "Forwarded" label. Attachments go along. Hidden for deleted messages                                          | A student shares a flat offer or a notes link                               |
| Edit group (owner)  | The owner changes group name, photo and description             | "Edit" button in Group info opens a dialog. Save is disabled until something changes. Members see a system message: "Owner changed the group name"                                                     | A group changes subject, for example a new semester                         |
| Report with details | Report one message with a reason and a note                     | Reasons: Spam, Harassment, Fake housing offer, Inappropriate content, Something else. Optional note. Uses the existing `/reports` API (5 per hour). The reporter stays hidden from the reported person | Moderators need context to act on fake offers or abuse                      |

Build order for P2: Drafts and Pinned bar first (small and useful), then Forward and Edit group, then Report details (safety), then Polls and Voice notes (need the most backend work). Blocking is not part of this work: it already exists on the public profile page, and the chat only respects it (locked message field with "Unblock").

Backend needs for P2 are listed below in "Open backend needs".

### P2 — student tools

These features come from student life: housing, study groups and trust. They are in scope for the release. Each one is drawn in frame `05i · Chat · Student tools`.

| Feature                 | What it means                               | How it works                                                                                                                                                                                                                                                                             | Useful when                                                           |
| ----------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Viewing scheduler       | Agree on a viewing time with one card       | Only in chats tied to a housing post. The sender picks 2 or 3 time slots and sends the card. The other person taps Accept (one slot) or Suggest another time (sender gets a new card). Accepted time shows as a confirmed card and can be added to the calendar. Expired slots turn grey | Two students need to agree on a viewing without a long back-and-forth |
| Share a Uniezz card     | Send a post, course or notes as a rich card | Picker from the attach menu: My posts, Saved, Courses. The card shows thumbnail, title and live status (for example "1 room left"). Tap opens the item. If the item is deleted, the card shows "No longer available"                                                                     | A student sends a flat to a friend or course notes to a group         |
| Safety banner           | A short safety tip in housing chats         | Amber banner under the header: "Do not pay a deposit before you see the flat." Can be dismissed per chat. Comes back for a new housing chat                                                                                                                                              | A student writes to a stranger about a flat                           |
| Starter replies         | Tap-to-send first messages                  | Shown only in an empty chat started from a post. 3 chips, for example "Is the room still available?". Tap sends the text at once. They disappear after the first message                                                                                                                 | The first message is the hardest to write                             |
| Share a meeting point   | Send a pin near campus                      | Attach menu, Location. Choose a place on the map, see walking time, tap Send. Optional switch: share live location for 1 hour. It stops by itself and a banner shows "Sharing live location · Stop". Needs location permission                                                           | First viewings and meetups                                            |
| Event card with RSVP    | A plan with date, place and answers         | Created in groups (attach menu, Event). Fields: title, date, time, place. Members tap Going, Maybe or No. The card shows counts and avatars. The creator can edit or cancel. Reminder 1 hour before for people who said Going                                                            | A group plans a study session                                         |
| Announcement mode       | Only admins can post                        | Switch in Group info, Settings. Members see a lock row instead of the composer: "Only admins can post in this group." Members can still read, react and reply in comments only if allowed later                                                                                          | Faculty and dorm groups where news must not get lost                  |
| Invite link and QR code | Join a group with one tap                   | Group info shows link, Copy, Share and a QR code. Admins can reset the link, and the old one stops working. Optional: admin must approve new members                                                                                                                                     | New semester, many people join a dorm or course group                 |
| Notification level      | Control noise per chat                      | Three levels: All messages, Mentions only, Muted. Muted can be 1 hour, 8 hours or until you turn it on. The list row shows a bell-off icon when muted                                                                                                                                    | A busy group chat                                                     |

Build order for student tools: Notification level, Safety banner and Starter replies first (small), then Invite link and Announcement mode, then Share a Uniezz card and Event card, then Viewing scheduler and Meeting point (need new card types and location permission).

## Screens

| Frame                          | Shows                                                                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `05 · Chat · v2`               | Today. Kept for reference                                                                                                                                |
| `05a · Chat · Thread v3`       | Main screen: grouped bubbles, context card, reactions, reply quote, hover action bar, seen status, date chips, new messages divider, jump to latest      |
| `05b · Chat · Composer states` | Default, typing, reply preview, attachments, existing emoji picker, mention list, voice recording                                                        |
| `05c · Chat · Message menu`    | Reaction bar and context menu                                                                                                                            |
| `05d · Chat · Group`           | Sender names and colors, mentions, group info panel                                                                                                      |
| `05e · Chat · List states`     | Pinned, muted, typing preview, unread, requests, right-click menu, loading, empty                                                                        |
| `05g · Chat · System states`   | Sending, send error (toast and draft), offline, blocked, request pending, error                                                                          |
| `05h · Chat · More features`   | Voice notes, pinned bar, drafts, polls, forward, edit group, report with details                                                                         |
| `05i · Chat · Student tools`   | Viewing scheduler, Uniezz cards, safety banner and starter replies, meeting point, event RSVP, announcement mode, invite link and QR, notification level |

New reusable components live in frame `00b · Chat Kit · v2`: `UIMessage / In`, `UIMessage / Out`, `UIReaction`, `UIChatComposer`, `UIDateChip`, `UIContextCard`.

Notes: in `05d` the conversation list is hidden while the group info panel is open, so the thread keeps enough width. Link preview and the typing bubble are shown in `05d`. Pinned message bar, deleted and edited messages are shown in `05c`.

## Visual rules

- Panels: reuse `UIPanel` glass. Do not add shadows. Depth comes from borders and blur.
- Outgoing bubble: `blue` fill, white text. Incoming: `white-10` fill with a `white-10` border.
- Radius: bubble `20`, tail corner `6`, reaction pill full, menu `16`.
- Type: body 15 for messages, caption 11 for time and status, label 14 for names.
- Spacing: 2 px inside a group, 12 px between groups, 24 px around date chips.
- Color for group member names: use `sky`, `green`, `amber`, `pink` from the existing tokens. Never use red (danger only).
- Contrast: text on `white-10` must stay readable. Muted text is only for time and hints.

## Accessibility

- The message list keeps `role="log"`. New messages are announced politely.
- Every icon button has an `aria-label`. The hover action bar is also reachable by keyboard (focus a message, press Enter).
- Reactions are buttons with `aria-pressed`.
- Status icons have text alternatives ("Sent", "Seen").
- Motion respects `prefers-reduced-motion`.
- Visible focus ring on all controls.

## Analytics

Autocapture already records clicks and submits. Add named events only for outcomes autocapture cannot see (see `docs/analytics.md`).

| Event                                                | When                                          |
| ---------------------------------------------------- | --------------------------------------------- |
| `message_send_failed`                                | Send fails (a toast is shown)                 |
| `message_reaction_set`                               | Reaction saved (mutation `analyticsAction`)   |
| `message_delete`                                     | Delete succeeds, with `scope: me or everyone` |
| `message_request_accept` / `message_request_decline` | Request answered                              |
| `chat_search_used`                                   | Search in chat returns results                |

All clickable elements need `data-ph-capture-attribute-label` with a fixed action text, never message content or names.

## Open backend needs

The current API has none of this. Needed for P0, P1 and P2:

- Threads and messages: list, history with cursor pagination, send, edit, delete.
- Realtime channel: new message, typing, presence, read receipts, reactions.
- Message fields: `id`, `senderId`, `createdAt`, `status`, `replyToId`, `editedAt`, `deletedAt`, `reactions`, `postId`.
- Read state: `lastReadMessageId` per member, unread counts.
- Chat settings per user: pinned, muted, archived.
- Message requests: state per thread (pending, accepted, declined).
- Uploads: allow files, not only images, for `kind=chat` (today a TODO in `src/schemas/chat.ts`).
- Link preview endpoint.
- Moderation: reuse `/reports` for messages.
- P2: pinned messages per thread (max 3), polls with votes, forwarded-message marker, group edit (name, photo, description) with a system message, report reasons, audio upload for voice notes. Drafts stay on the client (local storage per chat).
- Student tools: card message types (viewing request with slots and answer, Uniezz item card, location, event with RSVP), live location with a timer, group settings (announcement mode, invite link with reset and optional approval), per-user notification level per thread, and a reminder job for events.

Task plan reference: `docs/tasks/TASKS.en.md`, Sprint 3, FE-3.1 to FE-3.9 and BE-3.1 to BE-3.9.

## Review decisions (PR #19)

- **Emoji picker:** we keep the existing `UIEmojiPicker`. The emoji grid in the frames is only an example.
- **No swipe:** phone users are blocked on the web, so there are no swipe or long-press actions. Chat rows and messages use right-click, hover and a "More" button.
- **Send errors:** when a send fails, the app shows a toast and keeps the text in the message field as a draft. There is no failed bubble and no Retry button.
- **Block user:** it already exists on the public profile page, so it is removed from the chat features. The chat only respects it.
- **Verified student badge:** removed from the scope.

## Scope and checks

- This work is design and documentation only. No code in `src/` changes.
- Each frame is checked for clipping, contrast and spacing.
- Every feature in this document appears in at least one frame.
