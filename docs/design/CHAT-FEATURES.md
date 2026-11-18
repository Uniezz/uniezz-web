# Uniezz chat — feature guide

Last edited: 2026-11-18

This guide describes every feature of the new Uniezz chat in plain language. It says what each feature is, how it works for the user, and where you can see it in the design file `uniezz-web-app.pen`. It does not cover code, backend or visual rules. For those, read [CHAT.md](CHAT.md).

## How to read this guide

- **What it is** says what the user gets.
- **How it works** says what the user does and what happens.
- **See it in** names the frame in the `.pen` file. Frame names start with `05`, for example `05a · Chat · Thread v3`.
- **Built today** means the feature already exists in the app. Everything else is new.

All features here are in the release scope. Build order is in `CHAT.md`.

## Where to find things in the design file

| Frame                          | What is inside                                                             |
| ------------------------------ | -------------------------------------------------------------------------- |
| `05 · Chat · v2`               | The chat as it is today (for comparison)                                   |
| `05a · Chat · Thread v3`       | The main conversation screen                                               |
| `05b · Chat · Composer states` | Every state of the message field                                           |
| `05c · Chat · Message menu`    | Reactions, message menu, delete dialog                                     |
| `05d · Chat · Group`           | A group chat and the Group info panel                                      |
| `05e · Chat · List states`     | The list of chats in all its states                                        |
| `05g · Chat · System states`   | Sending, failed, offline, requests, blocked, errors                        |
| `05h · Chat · More features`   | Voice notes, pinned bar, drafts, polls, forward, edit group, block, report |
| `05i · Chat · Student tools`   | Viewing scheduler, Uniezz cards, meeting point, events and more            |
| `00b · Chat Kit · v2`          | The reusable parts (bubbles, reactions, date chip, context card, composer) |

---

## 1. Chat list

### Search and filters

- **What it is:** A search field and filter chips above the list: All, Groups, Requests.
- **How it works:** The user types a name and the list filters at once. The Requests chip shows a number when someone new wrote to them. Today the app has the filters All, Groups and Connections; the design replaces Connections with Requests.
- **See it in:** `05e`, column "Default".
- **Built today:** Search and filters (with Connections instead of Requests).

### Unread badge

- **What it is:** A blue number on a row with new messages. Unread rows also show the preview and the time in a stronger style.
- **How it works:** The number goes away when the user opens the chat. In a muted chat the badge is grey, so it does not shout.
- **See it in:** `05e`.
- **Built today:** The badge in the list. The badge on the sidebar item is new.

### Pinned chats

- **What it is:** Important chats stay at the top of the list under a "Pinned" label.
- **How it works:** The user pins a chat from the row menu or by swiping. Up to 3 chats can be pinned. A small pin icon shows next to the name.
- **See it in:** `05e`, section "Pinned".

### Muted chats

- **What it is:** A chat that does not send notifications. The row shows a small bell-off icon.
- **How it works:** See "Notification level" in section 6.
- **See it in:** `05e`, rows "Erasmus Lublin" and "Dormitory Helios".

### Live preview: typing and draft

- **What it is:** The row preview can show "is typing" with three dots, or a red "Draft:" with the text the user started to write.
- **How it works:** Typing shows while the other person writes. A draft shows until the user sends it or deletes it.
- **See it in:** `05e`, rows "Kateryna Melnyk" (typing) and "Anna Nowak" (draft).

### Online dot

- **What it is:** A small green dot on the avatar when the person is online.
- **See it in:** `05e`, "Kateryna Melnyk" and "Taras Hnatiuk".

### Row actions

- **What it is:** Quick actions for a chat: Pin, Mute, Mark as read, Archive, Delete chat.
- **How it works:** On the web, right-click or the "more" button opens a menu. On a phone, swipe the row to see Pin, Mute and Archive.
- **See it in:** `05e`, column "Row actions".

### Loading, no results and empty list

- **What it is:** Three states. Loading shows grey placeholder rows. "No chats found" appears when a search has no result. "No chats yet" appears for a new user and offers "Find people".
- **See it in:** `05e`, column "Loading and empty".
- **Built today:** An empty state with the cat. The loading and search states are new.

---

## 2. Conversation basics

### Real-time messages

- **What it is:** New messages appear at once, without reloading the page.
- **How it works:** If the connection drops, the chat shows an offline banner and keeps the messages the user writes. They are sent when the connection comes back.
- **See it in:** Offline banner in `05g`.

### Message status

- **What it is:** A small icon on each message you sent that tells you where it is.
- **How it works:**
  - Clock: sending.
  - One check: sent.
  - Two checks: delivered.
  - Two blue checks: seen.
  - Red "Not sent" with a Retry button: it failed.
- **See it in:** Status icons in `05a` (outgoing bubbles) and `00b`. Sending and failed states in `05g`.

### Seen by

- **What it is:** In a group, tiny avatars of the people who read your last message, with "Seen by 3".
- **See it in:** `05d`, below the blue message.

### Typing indicator

- **What it is:** A bubble with three soft dots. In a group it can say "Anna and Taras are typing".
- **See it in:** `05a` (bottom of the thread) and `05d`.
- **Built today:** A fake version for one chat. The real one is new.

### Presence

- **What it is:** The header says "Online", or "Last seen 14:20" when the person is away.
- **See it in:** The header of `05a`.

### Date separators

- **What it is:** A small centered label such as "Yesterday" or "Today" between days.
- **See it in:** `05a`.

### New messages divider

- **What it is:** A blue line with "2 new messages" at the first message the user has not read.
- **How it works:** It disappears when the user has read the messages or leaves the chat.
- **See it in:** `05a`.

### Grouped bubbles

- **What it is:** Messages from the same person in a row form one group. Only the last bubble has the sharp corner, and only that one shows the avatar.
- **How it works:** A group ends after 5 minutes or when the sender changes.
- **See it in:** `05a`, `05d` and the two bubbles in `00b`.

### Sender names in groups

- **What it is:** The name of the sender above the first bubble of a group, each person in their own color.
- **See it in:** `05d`.

### Jump to latest

- **What it is:** A round arrow button in the bottom right of the thread. It shows a number when new messages came while the user was scrolling up.
- **See it in:** `05a`, bottom right of the messages.

### Loading, empty, error and offline states

- **What it is:** The thread never shows a blank panel. Loading shows placeholder bubbles. An empty thread says "No messages yet" and offers "Say hi". An error says "Messages did not load" and offers "Try again". The offline banner explains what happens to new messages.
- **See it in:** `05g`.
- **Built today:** The empty state. The others are new.

---

## 3. Working with a message

### Hover action bar

- **What it is:** Three small buttons that appear next to a message when the user hovers: React, Reply, More.
- **How it works:** On a phone, a long press opens the same actions, and swiping right replies.
- **See it in:** `05a`, next to the message with the quote.

### Reply

- **What it is:** Answer a specific message. The new message shows the old one as a small quote on top.
- **How it works:** The user taps Reply. A preview bar appears above the message field with an X to cancel. Tapping the quote in a bubble scrolls to the original message and highlights it.
- **See it in:** Quote inside the bubble in `05a`. Preview bar above the composer in `05a` and `05b` ("Reply" state).

### Reactions

- **What it is:** A quick emoji answer to a message. Small pills under the bubble show the emoji and the count. A blue pill means you reacted.
- **How it works:** Six quick emojis show on hover or long press, and a plus button opens the full emoji picker. One reaction per person per message. Tapping your own reaction removes it.
- **See it in:** Reaction bar in `05c`. Pills under a bubble in `05a`. The reaction part in `00b`.

### Message menu

- **What it is:** A menu with Reply, Copy text, Edit, Pin to chat, Report and Delete.
- **How it works:** Edit appears only for your own messages, within 15 minutes, and the message then shows "edited". Report appears for other people's messages.
- **See it in:** `05c`.

### Delete

- **What it is:** A dialog with "Delete for everyone", "Delete for me" and "Cancel".
- **How it works:** Delete for everyone leaves the text "Message deleted" in the chat, so the conversation still makes sense.
- **See it in:** `05c`, the dialog in the middle and the "Message deleted" row on the right.

### Edit

- **What it is:** Change the text of a message you sent.
- **See it in:** `05c`, the blue bubble with "edited · 09:44".

### Link preview

- **What it is:** When someone sends a web link, a small card shows an image, a title and the site name.
- **See it in:** `05d`, the message from Julia.

### Mentions

- **What it is:** In a group, typing @ opens a list of members. The chosen name appears in blue. The mentioned person gets a stronger notification.
- **How it works:** Arrow keys move in the list and Enter picks a name.
- **See it in:** The list in `05b` (state "Mention"). A mention inside a bubble in `05d`.

### Search in a chat

- **What it is:** Find words inside one conversation.
- **How it works:** The search icon in the header opens a bar with the number of results and up and down arrows. Matches are highlighted in the bubbles.
- **See it in:** The search icon in the header of `05a`. There is no separate frame for the open search bar.

---

## 4. Message field (composer)

### Basic field

- **What it is:** A text field that grows up to 5 lines, then scrolls. Buttons for attach and emoji. The send button shows when there is text.
- **How it works:** Enter sends. Shift+Enter adds a new line. The limit is 4000 characters.
- **See it in:** `05b`, states "Empty" and "Typing". The reusable part in `00b`.
- **Built today:** Yes.

### Attachments

- **What it is:** Up to 5 images or files per message. Each draft shows a thumbnail or a file card with an X. A progress bar shows while it uploads.
- **See it in:** `05b`, state "Attachments".
- **Built today:** Attachments, thumbnails and image gallery. The progress bar is new.

### Emoji picker

- **What it is:** A panel with search and a grid of emojis above the field.
- **See it in:** `05b`, state "Emoji".
- **Built today:** Yes.

### Voice recording

- **What it is:** A recording bar with a red dot, time, waveform and a send button.
- **How it works:** Hold the mic to record. Slide left to cancel. Tap the lock to record hands-free.
- **See it in:** `05b`, state "Recording". The finished voice message is in `05h`.

---

## 5. Context card

- **What it is:** When a chat starts from a post (a flat, a course, notes), a card under the header shows that post: picture, title and live status such as "1 room left". It is the signature feature of Uniezz chat.
- **How it works:** "Open post" goes to the post. When the user scrolls, the card shrinks to a one-line chip, so it does not take space. If a chat has no post, there is no card.
- **See it in:** `05a`, under the header. The reusable part in `00b`.
- **Built today:** A fixed card for one chat. The live status and the shrinking are new.

---

## 6. Groups

### Group info panel

- **What it is:** A panel on the right with the group photo, name, member count, quick buttons (Mute, Search, Add), tabs (Members, Media, Files, Links) and "Leave group".
- **How it works:** It opens from the header. On a phone it is a full-screen sheet. In the design the chat list is hidden while this panel is open, so the thread keeps enough width.
- **See it in:** `05d`, right side.

### Members and roles

- **What it is:** A list of members with small role labels such as Owner and Admin.
- **See it in:** `05d`, in the info panel.

### Edit group (owner only)

- **What it is:** The owner can change the group name, photo and description.
- **How it works:** An "Edit" button in the info panel header opens a dialog. Save stays disabled until something changes. Members see a system message such as "Owner changed the group name". Admins and members do not see the button.
- **See it in:** The button in the info panel in `05d`. The dialog in `05h`.

### Announcement mode

- **What it is:** The admins can set the group so that only admins can write.
- **How it works:** A switch in the group settings. Members still read and react. Instead of the message field, they see "Only admins can post in this group."
- **See it in:** `05i`.

### Invite link and QR code

- **What it is:** A link and a QR code to join the group in one tap.
- **How it works:** The info panel shows the link with Copy and Share. Admins can reset the link, and the old one stops working. An admin can also ask to approve new members first.
- **See it in:** `05i`.

### Notification level

- **What it is:** Each chat has its own notification setting: All messages, Mentions only, or Muted. Muted can last 1 hour, 8 hours, or until the user turns it on.
- **See it in:** `05i`.

### Create group

- **See it in:** Not in the new frames.
- **Built today:** Yes (name, photo, member search, unsaved changes warning).

---

## 7. Trust and safety

### Safety banner

- **What it is:** A short amber tip in housing chats: "Do not pay a deposit before you see the flat."
- **How it works:** The user can close it. It shows again in a new housing chat.
- **See it in:** `05i`.

### Starter replies

- **What it is:** Three tap-to-send first messages in an empty chat that started from a post, such as "Is the room still available?".
- **How it works:** One tap sends the message. The chips disappear after the first message.
- **See it in:** `05i`, under the safety banner.

### Verified student badge

- **What it is:** A small badge after the name when the person confirmed their university email.
- **How it works:** Tapping it explains what was verified and when.
- **See it in:** `05i`.

### Message requests

- **What it is:** When someone who is not a connection writes first, the chat goes to Requests. The message field is locked until the user decides.
- **How it works:** The user taps Accept, Decline or Report.
- **See it in:** `05g` ("Request from a stranger") and the Requests chip in `05e`.

### Block user

- **What it is:** A blocked person cannot message you and cannot see when you are online.
- **How it works:** A dialog explains this and has a switch "Also report this person". The message field shows "You blocked [name]. Unblock to send a message."
- **See it in:** The dialog in `05h`. The locked field in `05g`.

### Report a message

- **What it is:** Tell the moderators what is wrong with a message.
- **How it works:** The user picks a reason (Spam, Harassment, Fake housing offer, Inappropriate content, Something else) and can add a note. The person who is reported never learns who reported.
- **See it in:** `05h`.

---

## 8. More ways to talk

### Voice notes

- **What it is:** A short audio message.
- **How it works:** The bubble has a play button, a waveform, the length, and a speed button (1x, 1.5x, 2x).
- **See it in:** `05h` (the message). Recording is in `05b`.

### Pinned messages bar

- **What it is:** A bar at the top of the chat with an important message, such as a lab time.
- **How it works:** Owner and admins can pin up to 3 messages. The bar shows "Pinned · 1 of 3". Tapping it jumps to the message.
- **See it in:** `05h`. The "Pin to chat" action is in `05c`.

### Drafts per chat

- **What it is:** Text you started to write is saved for each chat.
- **How it works:** The chat list shows "Draft:" in red. Opening the chat puts the text back in the field.
- **See it in:** `05h` and `05e`.

### Forward a message

- **What it is:** Send a message to another chat.
- **How it works:** A dialog with search and checkboxes opens. The user can pick up to 5 chats. The copy shows a small "Forwarded" label. Deleted messages cannot be forwarded.
- **See it in:** `05h`.

### Polls

- **What it is:** A group member asks a question with 2 to 6 options and everyone votes.
- **How it works:** One vote per person, changeable until the poll ends. Bars and percentages update live. The card shows voter avatars, the number of votes and the time left. The creator can close it.
- **See it in:** `05h`.

---

## 9. Student tools

### Viewing scheduler

- **What it is:** In a housing chat, one card with 2 or 3 time slots for a viewing.
- **How it works:** The sender picks the slots and sends the card. The other person taps Accept on one slot, or "Suggest another time" and sends new slots back. The agreed time can be added to the calendar.
- **See it in:** `05i`.

### Share a Uniezz card

- **What it is:** Send a post, a course or notes as a rich card with a picture and live status, not a plain link.
- **How it works:** The user picks it from the attach menu (My posts, Saved, Courses). Tapping the card opens it inside Uniezz. If the item was deleted, the card says "No longer available".
- **See it in:** `05i`.

### Share a meeting point

- **What it is:** Send a pin on the map, for example "UMCS main gate", with the walking time.
- **How it works:** An optional switch shares the live location for 1 hour. It stops by itself, and a banner lets the user stop it earlier. The phone must allow location access.
- **See it in:** `05i`.

### Event card with RSVP

- **What it is:** A plan with title, date, time and place, for example "Study session, Fri 16:00, Library".
- **How it works:** Members answer Going, Maybe or No. The card shows the counts and avatars. People who said Going get a reminder 1 hour before. The creator can edit or cancel.
- **See it in:** `05i`.

---

## Quick list: what is new and what exists

| Already built                                  | New in this design                                            |
| ---------------------------------------------- | ------------------------------------------------------------- |
| Chat list, search, filters, unread badge       | Pin, mute, drafts, typing preview, row actions, requests      |
| Text messages, time, image gallery, file cards | Real-time, status icons, date separators, grouped bubbles     |
| Composer with emoji and attachments            | Reply, reactions, edit, delete, mentions, voice               |
| Create group                                   | Group info, roles, owner edit, announcement mode, invite link |
| Empty state with the cat                       | Loading, error, offline and request states                    |
| A fixed card for one post                      | Live context card, safety banner, verified badge              |
| —                                              | Polls, forward, pinned bar, block, detailed report            |
| —                                              | Viewing scheduler, Uniezz cards, meeting point, event RSVP    |
