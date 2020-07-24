export const REQUEST_NEWS = 'REQUEST_NEWS';
export const RECEIVE_NEWS = 'RECEIVE_NEWS';
export const VIEW_NEWS = 'VIEW_NEWS';


function requestNews(loading = true) {
  return {
    type: REQUEST_NEWS,
    payload: true
  }
}
export function setViewNews(data) {
  return {
    type: VIEW_NEWS,
    payload: data
  }
}

function receiveNews(json) {
  return {
    type: RECEIVE_NEWS,
    payload: json
  }
}

export function fetchFreshNews(page = 1, domain) {
  return dispatch => {
    dispatch(requestNews());

    loadMoreNewsApi(page,domain).then( (data = {}) => {
      if(data.status === 'error'){
        requestNews(false);
        return;
      }
      const state = data.articles;

      dispatch(receiveNews(state))
    }).catch(e => {
      requestNews(false);
    });
  }
}

export function fetchApps(page = 1,domain) {
  return (dispatch, getState) => {
    dispatch(requestNews());

    loadMoreNewsApi(page,domain).then( (data = {}) => {
      if(data.status === 'error'){
        requestNews(false);
        return;
      }
      const state = [ ...getState().news, ...data.articles];

      dispatch(receiveNews(state))
    }).catch(e => {
      requestNews(false);
    });
  }
}

function shouldFetchApps(state) {
  const news = state.news;
  if (news.length === 0) {
    return true
  } else if (state.isFetching) {
    return false
  }
}

export function fetchAppsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchApps(getState())) {
      return dispatch(fetchApps())
    }
  }
}

export async function loadMoreNewsApi(page = 1, domain){
  let url = `http://newsapi.org/v2/everything?apiKey=b3beb9f2d3174575aa1c404d52c10c43&page=${page}&language=en`;
  // eslint-disable-next-line eqeqeq
  if(!domain || domain == '0') {
    const sourceUrl = 'https://newsapi.org/v2/sources?apiKey=b3beb9f2d3174575aa1c404d52c10c43&category=technology&language=en';
    let sources = await fetch(sourceUrl)
      .then(response => response.json())
      .then(response => {
          // console.log(response.sources)
          return response.sources.map(s => {
            let tempDomain = (new URL(s.url)).hostname;
            return tempDomain.indexOf('www.') === 0 ? tempDomain.slice(4) : tempDomain;
            // return s.name
          })
        }
      )
      .catch(e => console.log(e));
    sources = sources || [];
    url = url + '&q=' + sources.join(' OR ');
    // console.log(url);
    return fetch(url)
      .then(response => response.json())
  } else {
    url = url + '&q=' + domain;
    return fetch(url)
      .then(response => response.json())
  }
};
