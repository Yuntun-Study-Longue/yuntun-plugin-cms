// import Cookies from 'js-cookie';

export const AUTHENTICATE = 'auth/AUTHENTICATE';
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';

const initialState = {
    isAuthenticated: false,
    currentUser: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: action.authenticated
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.user
      };

    default:
      return state;
  }
};