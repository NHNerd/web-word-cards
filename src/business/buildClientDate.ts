import { getUserId, emailById } from '../axios/user.ts';
import { getAllLists } from '../axios/list.ts';
import { getAllWords } from '../axios/words.ts';

import buildClientDateFirstTime from './buildClientDateFirstTime.ts';

// structured data is collected here Every time the page is reloaded
// data is taken from localstorage if localstorage  exists otherwise from mongodb

type ListData = {
  listId: string;
  listName: string;
  order: number;
  wordCount: number;
  gameCount: number;
  words: any[];
};

const data: ListData[] = [];
async function buildClientDate(email: string): Promise<ListData[]> {
  const dateStart = Date.now();

  //email is delited
  // or in time sign-in email = null
  if (!email) {
    //email && userId is delited
    const userId = localStorage.getItem('userId');
    email = localStorage.getItem('email') || (await emailById(userId));
  }

  // get user Id by email
  const userId = localStorage.getItem('userId') || (await getUserId(email));

  // FIRST time scenario
  const isFirstTime = JSON.parse(localStorage.getItem('registration')) || false;
  if (isFirstTime) return await buildClientDateFirstTime(data);

  // get all lists Id by user Id
  const allLists = JSON.parse(localStorage.getItem('allLists')) || (await getAllLists(userId));
  if (!allLists) {
    console.log('bild client date 33%: _id :(');
    return data;
  }

  // Creating structured data
  const allListsId: [] = [];
  allLists.map((list) => {
    const listId = list._id;
    const listName = list.listName;
    const order = list.order;
    const wordCount = 0;
    const gameCount = list.gameCount;
    const words: [] = [];

    data.push({ listId, listName, order, wordCount, gameCount, words });

    //collect all lists id for get all users words
    allListsId.push(listId);
  });

  // Write words and gameCount in lists
  const Allwords = JSON.parse(localStorage.getItem('Allwords')) || (await getAllWords(userId));
  if (!Allwords) {
    console.log('B U S I N E S S: data created: _id, list :|');
    return data;
  }

  // craate map
  const words = {};
  // only one iteration for all words
  Allwords.forEach((word) => {
    // Если массив для данного listId уже существует, добавляем в него слово
    if (words[word.listId]) words[word.listId].push(word);
    // Если массива для данного listId еще нет, создаем его и добавляем слово
    else words[word.listId] = [word];
  });

  // only one iteration for all list - create fild wordCount
  data.forEach((list) => {
    const listWord = words[list.listId];
    list.words = listWord || [];
    list.wordCount = listWord?.length || 0;
  });
  //? O = "order of growth" (Big-O Notation)
  //? n = Allwords
  //? m = AllLists
  //? O(n+m) - liner

  const dateEnd = Date.now();
  console.log('Building time:', (dateEnd - dateStart) / 1000, 's.');

  console.log('bild client date 100%: _id, list,  :)');
  return data;
}

export default buildClientDate;
