import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchAppsIfNeeded, fetchApps, fetchFreshNews, setViewNews } from '../redux/actions'
import NewsList from './NewsList';
import SideBarNews from './SideBarNews';
import { Menu } from 'antd';
import NewsView from "./NewsView";

function parseQuery(queryString) {
  const query = {};
  if(!queryString)
    return query;
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  pairs.forEach(p => {
    let pair = p.split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  } );
  return query;
}
class App extends Component {

  constructor(props) {
    super(props);

    const queryParam = props.location ? parseQuery(props.location.search) : {};
    this.state = {
      domain: queryParam.domain ? [queryParam.domain] : [0],
      viewMode: false
    };
  }
  componentDidMount() {
    const { dispatch,history } = this.props;
    dispatch(fetchAppsIfNeeded());

    this.backListener = history.listen(location => {
      if (location.action === "POP") {
        // Do your stuff
        const queryParam = location ? parseQuery(location.search) : {};
        this.setState({
          domain: queryParam.domain ? [queryParam.domain] : [0],
          viewMode: queryParam.viewMode && queryParam.viewMode === 'true'
        });
      }
    });
  }

  componentWillUnmount() {
    this.backListener();
  }

  loadNextPage(page){
    const { dispatch } = this.props;
    dispatch(fetchApps(page,this.state.domain))
  };

  handleDomainChange(e){
    const { dispatch, history } = this.props;
    dispatch(fetchFreshNews(1,e.key));
    this.setState({domain: e.key});
    history.push(`${history.location.pathname}?domain=${e.key}`)
  };
  generateQueryString (pathname = '', queryObj = {}, key, value) {
    queryObj[key] = value;
    let path = pathname;
    Object.keys(queryObj).forEach((q,i) => {
      i === 0 ? path = `${path}?${q}=${queryObj[q]}` : path = `${path}&${q}=${queryObj[q]}`;
    });
    return path;
  };

  handleNewsClicked(news){
    const { dispatch, history } = this.props;
    const queryParam = history ? parseQuery(history.location.search) : {};
    dispatch(setViewNews(news));
    this.setState({ viewMode: true });
    history.push(this.generateQueryString(history.location.pathname, queryParam, 'viewMode', true));
  };
  handleBackClicked(){
    const { dispatch, history } = this.props;
    const queryParam = history ? parseQuery(history.location.search) : {};
    dispatch(setViewNews(null));
    history.push(this.generateQueryString(history.location.pathname, queryParam, 'viewMode', false));
  };

  render() {
    const { isFetching, news, trend, sources, viewNews, history } = this.props;
    const queryParam = history ? parseQuery(history.location.search) : {};
    return (
       <div>
         <Menu mode="horizontal" selectedKeys={this.state.domain} onClick={e => this.handleDomainChange(e)} selectable style={{ padding: '0 40px', position: 'fixed', top: 0, zIndex: 100 , width: '100%'}}>
           <Menu.Item key={0}>
             All
           </Menu.Item>
           {sources.map((s,i) => (
           <Menu.Item key={s.domain}>
             {s.name}
             </Menu.Item>
           ))
           }
         </Menu>
         <div style={{ marginTop: '40px', padding: '40px', paddingLeft: '90px', display: 'flex', justifyContent: 'space-between'  }}>
           { !viewNews || !this.state.viewMode ? <NewsList onNewsClicked={news => this.handleNewsClicked(news)} loadNextPage={page => this.loadNextPage(page)} isFetching={isFetching} news={news} /> :
            <NewsView onBack={() => this.handleBackClicked()} news={viewNews}/>}
          <SideBarNews onNewsClicked={news => this.handleNewsClicked(news)} news={trend} />
         </div>
       </div>
    );
  }
}
 
function mapStateToProps({ isFetching, news, trend,sources, viewNews }) {
  return {
    isFetching,
    news,
    trend,
    sources,
    viewNews
  }
}
 
export default connect(mapStateToProps)(App)
