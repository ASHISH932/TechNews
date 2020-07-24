import { REQUEST_NEWS,  VIEW_NEWS, RECEIVE_NEWS } from './actions';

const initialState = {isFetching: false, apps: [], sources: [], trend: [], viewNews: null};

function apps( state = initialState, { type, payload }) {
  switch (type) {
    case REQUEST_NEWS:
      return { ...state, isFetching: payload };
    case RECEIVE_NEWS:
      return { ...state ,isFetching: false, news: payload  };
    case VIEW_NEWS:
      return { ...state , viewNews: payload  };
    default:
      return state;
  }
}

export default apps
