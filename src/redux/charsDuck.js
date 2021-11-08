import axios from "axios";
//constants
const initialData = {
  fetching: false,
  characters: [],
  current: {},
};

const URL = "https://rickandmortyapi.com/api/character";

const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCES = "GET_CHARACTERS_SUCCES";
const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

//reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
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

// actions(thunks)

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
