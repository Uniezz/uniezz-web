const eventTitle = 'Autumn Welcome Party';
const question = 'Statistics with dr hab. Nowak: is the final written or oral?';
const housing = 'Two rooms on Radziszewskiego';
const eventDescription = 'Campus club, Nadbystrzycka 38. Free with student ID until 21:00';
const questionAuthor = 'Olena Kovalenko';
const housingAuthor = 'Kateryna Melnyk';
const housingDescription = '1100 zł per person, bills included. From 1 October.';
const comments = [
  {
    id: 'comment-1',
    author: 'Anna Nowak',
    avatar: '/app/rPsdQ-2.jpg',
    text: 'Thanks for sharing this!',
  },
  {
    id: 'comment-2',
    author: 'Piotr Lewandowski',
    avatar: undefined,
    text: 'Could you share a few more details?',
  },
  {
    id: 'comment-3',
    author: 'Julia Wójcik',
    avatar: '/app/rPsdQ-4.jpg',
    text: 'This is really helpful.',
  },
  {
    id: 'comment-4',
    author: 'Tomasz Zieliński',
    avatar: undefined,
    text: 'Thanks for the details!',
  },
  {
    id: 'comment-5',
    author: 'Marta Wiśniewska',
    avatar: undefined,
    text: 'I was looking for this too.',
  },
  {
    id: 'comment-6',
    author: 'Jakub Kowalczyk',
    avatar: undefined,
    text: 'This answers my question.',
  },
  {
    id: 'comment-7',
    author: 'Alicja Kaczmarek',
    avatar: undefined,
    text: 'Could you share a bit more?',
  },
  { id: 'comment-8', author: 'Michał Mazur', avatar: undefined, text: 'Very useful, thank you.' },
  {
    id: 'comment-9',
    author: 'Natalia Król',
    avatar: undefined,
    text: 'I had the same experience.',
  },
  { id: 'comment-10', author: 'Paweł Wieczorek', avatar: undefined, text: 'Good to know!' },
  {
    id: 'comment-11',
    author: 'Zofia Jankowska',
    avatar: undefined,
    text: 'Thanks for sharing this.',
  },
  { id: 'comment-12', author: 'Kamil Pawlak', avatar: undefined, text: 'That makes sense.' },
  {
    id: 'comment-13',
    author: 'Lena Szymańska',
    avatar: undefined,
    text: 'Helpful context, thanks.',
  },
  { id: 'comment-14', author: 'Adam Nowicki', avatar: undefined, text: 'I can confirm this.' },
  { id: 'comment-15', author: 'Ola Kamińska', avatar: undefined, text: 'Following this thread.' },
  {
    id: 'comment-16',
    author: 'Krzysztof Lewandowski',
    avatar: undefined,
    text: 'Appreciate the information.',
  },
  {
    id: 'comment-17',
    author: 'Ewa Dąbrowska',
    avatar: undefined,
    text: 'This is useful for students.',
  },
  { id: 'comment-18', author: 'Bartek Wójcik', avatar: undefined, text: 'Thanks, that helps.' },
  {
    id: 'comment-19',
    author: 'Magda Kozłowska',
    avatar: undefined,
    text: 'Good to hear from someone who knows.',
  },
  {
    id: 'comment-20',
    author: 'Daniel Michalski',
    avatar: undefined,
    text: 'Thanks for the update!',
  },
];

const topPosts = [
  {
    id: 'coffee-code-meetup',
    type: 'event',
    title: 'Coffee & code meetup',
    university: 'Politechnika',
    summary: 'Live now',
    image: '/app/b4YP8L-0.jpg',
    comments,
  },
  {
    id: 'rowing-club-open-day',
    type: 'event',
    title: 'Rowing club open day',
    university: 'UMCS',
    summary: '13:00',
    image: '/app/b4YP8L-1.jpg',
    comments,
  },
  {
    id: 'bread-baking-workshop',
    type: 'event',
    title: 'Bread baking workshop',
    university: 'Przyrodniczy',
    summary: '16:30',
    image: '/app/b4YP8L-2.jpg',
    comments,
  },
  {
    id: 'erasmus-language-cafe',
    type: 'event',
    title: 'Erasmus language café',
    university: 'WSEI',
    summary: '18:00',
    image: '/app/b4YP8L-3.jpg',
    comments,
  },
  {
    id: 'autumn-welcome-party',
    type: 'event',
    title: eventTitle,
    university: 'Politechnika',
    summary: 'Tonight, 20:00',
    image: '/app/b4YP8L-4.jpg',
    body: eventDescription,
    comments,
  },
];

const posts = [
  {
    id: 'open-mic-night',
    type: 'event',
    title: 'Open mic night',
    author: 'KUL',
    university: 'KUL',
    summary: '21:00',
    body: '21:00 · KUL',
    image: '/app/b4YP8L-5.jpg',
    comments,
  },
  {
    id: 'statistics-final',
    type: 'question',
    title: question,
    author: questionAuthor,
    university: 'KUL',
    time: '9h',
    summary: 'Question · 9h',
    comments,
  },
  {
    id: 'two-rooms-radziszewskiego',
    type: 'post',
    category: 'housing',
    title: housing,
    author: housingAuthor,
    avatar: '/app/rPsdQ-1.jpg',
    university: 'UMCS',
    summary: '1d',
    body: housingDescription,
    image: '/app/b4YP8L-14.jpg',
    comments,
  },
];

// TODO(api): Replace this fixture module when feed consumers use the API.
export const FEEDMOCKS = {
  feed: { topPosts, posts },
  currentAuthor: 'Jan Kowalski · UMCS',
};
