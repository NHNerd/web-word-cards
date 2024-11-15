import axios from 'axios';
import API_URL from './_urls';

const axiosWord = axios.create({
  baseURL: `${API_URL}/apiWord`,
});

export const getAllWords = (userId) => {
  const src = '/getAll';

  const params = { userId };

  return axiosWord
    .get(src, { params })
    .then((data) => {
      const Allwords = data.data.allWords;
      //? convert object to string: JSON.stringify
      localStorage.setItem('Allwords', JSON.stringify(Allwords));
      return Allwords;
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Unknown errorMessage';
      const statusCode = error.response?.status || 'Unknown statusCode';
      if (statusCode === 404) {
        console.log(errorMessage, error);
        //! WHat I need return?????????
        return false;
      }
    });
};

export const putNewWord = async (listId, word: string, translate: string) => {
  const src = '/add';
  const userId = localStorage.getItem('userId');

  return axiosWord
    .post(src, { userId, listId, word, translate })
    .then((response) => {
      //TODO user can to change lsits order after crating new lsit,
      //TODO it's will throw an error, couse now I put list in start of array
      //TODO NEED: check new list order by listName

      // change new list in LS on right version from DB
      // const allLists = JSON.parse(localStorage.getItem('allLists'));
      // allLists.shift();
      // allLists.unshift(response.data.list[0]);

      //? convert object to string: JSON.stringify
      // localStorage.setItem('allLists', JSON.stringify(allLists));

      console.log(response.data.message);
      return response.data.newWord;
    })
    .catch((error) => {
      const statusCode = error.response.status;
      if (statusCode === 409) {
        console.log(error.response?.data.message);
        return statusCode;
      }
    });
};

interface Word {
  word: string;
  translate: string;
}

export const putNewBulkWord = async (listId: number, words: Word[]): Promise<any> => {
  const src = '/addBulk';
  const userId = localStorage.getItem('userId');

  return axiosWord
    .post(src, { userId, listId, words })
    .then((response) => {
      console.log(response.data.message);
      return response.data.newWords;
    })
    .catch((error) => {
      const statusCode = error.response.status;
      if (statusCode === 409) {
        console.log(error.response?.data.message);
        return statusCode;
      }
    });
};
