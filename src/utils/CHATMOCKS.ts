import type { Message, Conversation } from '@/@types';

const thread: Message[] = [
  {
    text: 'Hi! I saw your post about the flat on Radziszewskiego. Is one of the rooms still free?',
    outgoing: true,
    time: '14:02',
  },
  { text: 'Hi! Yes, both rooms are free from 1 October.', outgoing: false, time: '14:05' },
  {
    text: 'Great. Is 1100 zł really everything, or are bills separate in winter?',
    outgoing: true,
    time: '14:06',
  },
  {
    text: 'Everything is included: heating, water, electricity and internet. The only extra is a one-month deposit.',
    outgoing: false,
    time: '14:09',
  },
  {
    text: 'Sure, I can show you the flat on Thursday after 17:00 if that works for you?',
    outgoing: false,
    time: '14:11',
  },
];

const initialConversations: Conversation[] = [
  {
    name: 'Kateryna Melnyk',
    preview: 'Sure, I can show you the flat on Thursday',
    time: '2m',
    group: false,
    unread: 0,
    image: 1,
    messages: thread,
  },
  {
    name: 'Mechatronika, sem 5',
    preview: 'Taras: past papers are in the archive',
    time: '18m',
    group: true,
    unread: 4,
    image: 2,
    messages: [],
  },
  {
    name: 'Taras Hnatiuk',
    preview: 'Are you coming to the party on Friday?',
    time: '1h',
    group: false,
    unread: 1,
    image: 3,
    messages: [],
  },
  {
    name: 'Erasmus Lublin',
    preview: 'Anna: welcome to everyone who just joined',
    time: '3h',
    group: true,
    unread: 0,
    image: 4,
    messages: [],
  },
  {
    name: 'Anna Nowak',
    preview: 'Thanks for the statistics notes!',
    time: 'Yesterday',
    group: false,
    unread: 0,
    image: 5,
    messages: [],
  },
  {
    name: 'Dormitory Helios',
    preview: 'Julia: laundry room is fixed',
    time: 'Yesterday',
    group: true,
    unread: 0,
    image: 6,
    messages: [],
  },
  {
    name: 'Julia Wójcik',
    preview: 'See you at the job fair',
    time: 'Mon',
    group: false,
    unread: 0,
    image: 7,
    messages: [],
  },
];

const students = [
  { name: 'Kateryna Melnyk', meta: 'UMCS · Law · 2nd year' },
  { name: 'Taras Hnatiuk', meta: 'Politechnika' },
  { name: 'Marta Zielińska', meta: 'Informatyka · 2nd year' },
  { name: 'Jakub Nowak', meta: 'Mathematics · 1st year' },
  { name: 'Oleh Kovalenko', meta: 'Computer Science · 3rd year' },
  { name: 'Kateryna Melnyk1', meta: 'UMCS · Law · 3nd year' },
  { name: 'Kateryna Melnyk2', meta: 'UMCS · Law · 4nd year' },
];

const extraConversations: Conversation[] = ['Zofia', 'Piotr Lewandowski'].map((name) => ({
  name,
  preview: '',
  time: '',
  group: false,
  unread: 0,
  image: 0,
  messages: [],
}));

export const CHATMOCKS = {
  thread,
  initialConversations,
  students,
  extraConversations,
  status: 'Active now, UMCS Law, 2nd year',
  typing: '•••',
  context: 'Replying to a housing post',
  housing: 'Two rooms on Radziszewskiego, 1100 zł',
};
