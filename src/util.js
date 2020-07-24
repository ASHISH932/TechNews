const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const convertToNewsDate = date => {
  if(!date)
    return null;
  date = new Date(date);
  let d = months[date.getMonth()] + ' ' + date.getDate();
  if(date.getFullYear() !== (new Date()).getFullYear())
    d += ' ' + date.getFullYear();
  return d;
};


const getDomainFromUrl = (uri) => {
  let tempDomain =  (new URL(uri)).hostname;
  return tempDomain.indexOf('www.') === 0 ? tempDomain.slice(4) : tempDomain;
};

export async function loadInitialValue(page = 1,domain){
  let url = `http://newsapi.org/v2/everything?apiKey=b3beb9f2d3174575aa1c404d52c10c43&page=${page}&language=en`;

  const sourceUrl = 'https://newsapi.org/v2/sources?apiKey=b3beb9f2d3174575aa1c404d52c10c43&category=technology&language=en';
  const topHeadlines = 'https://newsapi.org/v2/top-headlines?apiKey=b3beb9f2d3174575aa1c404d52c10c43&category=technology&language=en&pageSize=10';
  let sourcesName = [];
  let sources = await fetch(sourceUrl)
    .then(response => response.json())
    .then(response => {
      sourcesName = response.sources.map(s => ({ name: s.name, domain: getDomainFromUrl(s.url) }));
      return response.sources.map(s =>  {
        return getDomainFromUrl(s.url);
      }) }
    )
    .catch(e => console.log(e));
  sources =  sources || [];
  let trend = await fetch(topHeadlines)
    .then(response => response.json())
    .then(response =>  response.articles)
    .catch(e => console.log(e));
  trend =  trend || [];
  // eslint-disable-next-line eqeqeq
  if(!domain || domain == '0') {
    url = url + '&q=' + sources.join(' OR ');
  } else {
    url = url + '&q=' + domain;
  }
  // console.log(url);
  return fetch(url)
    .then(response => ({ news: response.json(), sources: sourcesName, trend }))
}
