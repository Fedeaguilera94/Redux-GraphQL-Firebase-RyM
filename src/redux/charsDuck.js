import axios from "axios";
import { db, getFavs } from "../firebase";
import { doc, setDoc } from "@firebase/firestore";
import { saveStorage } from "./userDuck";
//constants
const initialData = {
  fetching: false,
  characters: [],
  current: {},
  favorites: [],
};

const URL = "https://rickandmortyapi.com/api/character";

const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCES = "GET_CHARACTERS_SUCCES";
const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";
const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCES = " GET_FAVS_SUCCES";
const GET_FAVS_ERROR = "GET_FAVS_ERROR ";

//reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case GET_FAVS_SUCCES:
      return {
        ...state,
        fetching: false,
        favorites: action.payload,
      };

    case GET_FAVS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };

    case GET_FAVS:
      return {
        ...state,
        fetching: true,
      };

    case ADD_TO_FAVORITES:
      return {
        ...state,
        ...action.payload,
      };
    case REMOVE_CHARACTER:
      return {
        ...state,
        characters: action.payload,
      };
    case GET_CHARACTERS:
      return {
        ...state,
        fetching: true,
      };
    case GET_CHARACTERS_SUCCES:
      return {
        ...state,
        characters: action.payload,
        fetching: false,
      };
    case GET_CHARACTERS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

const updateDb = async (array, id) => {
  const docRef = doc(db, "favs", id);
  const pay = { array };
  await setDoc(docRef, pay);
};

// actions(thunks)
export let retrieveFav = () => (dispatch, getState) => {
  dispatch({
    type: GET_FAVS,
  });
  let { uid } = getState().user;
  return getFavs(uid)
    .then((array) => {
      console.log("promise", array);
      dispatch({
        type: GET_FAVS_SUCCES,
        payload: array,
      });
      saveStorage(getState());
    })
    .catch((e) => {
      console.log(e);
      dispatch({
        type: GET_FAVS_ERROR,
        payload: e.message,
      });
    });
};

export let addToFavoritesAction = () => (dispatch, getState) => {
  let { characters, favorites } = getState().characters;
  let { uid } = getState().user;
  let char = characters.shift();
  favorites.push(char);
  updateDb(favorites, uid);
  dispatch({
    type: ADD_TO_FAVORITES,
    payload: {
      characters: [...characters],
      favorites: [...favorites],
    },
  });
};

export let removeCharacterAction = () => (dispatch, getState) => {
  let { characters } = getState().characters;
  characters.shift();
  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...characters],
  });
};

export let getCharactersAction = () => {
  return (dispatch, getState) => {
    dispatch({
      type: GET_CHARACTERS,
    });
    return axios
      .get(URL)
      .then((res) => {
        dispatch({
          type: GET_CHARACTERS_SUCCES,
          payload: res.data.results,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: GET_CHARACTERS_ERROR,
          payload: err.response.message,
        });
      });
  };
};

export let restoreFavs = () => (dispatch) => {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);
  if (storage && storage.characters.favorites.array) {
    dispatch({
      type: GET_FAVS_SUCCES,
      payload: storage.characters.favorites,
    });
  }
};
