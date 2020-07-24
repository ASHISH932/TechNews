import React from 'react';
import { Card } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import "isomorphic-fetch";
import { Typography } from 'antd';
import { convertToNewsDate } from '../util';
import InfiniteScroll from 'react-infinite-scroller';

const { Title, Paragraph, Text } = Typography;

const NewsList = ({ news, loadNextPage, isFetching, onNewsClicked }) => {
  const cards = news && <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={(e) => loadNextPage(((news.length)/20) + 1)}
      hasMore={!isFetching && news.length < 100}
      useWindow={true}
    >
      {news.map((n, index) => (
        <React.Fragment key={index}>
          <Card key={index} hoverable onClick={() => onNewsClicked(n)} bordered={false} style={{width: 780, maxHeight: 300}} loading={false}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <div className="app-meta" style={{marginRight: 15}}>
                  <Title level={4}> {n.title} </Title>
                  {/*<span className="app-lic">{app.description.slice(0,180)}</span>*/}
                  <Paragraph ellipsis={{rows: 2, expandable: false, symbol: 'more'}}>
                    {n.description}
                  </Paragraph>
                  <Text strong>{n.source.name}</Text><br/>
                  <Text>{convertToNewsDate(n.publishedAt)}</Text>
                </div>
              </div>
              <img className="app-icon" src={n.urlToImage} width="170"/>
            </div>
          </Card>
        </React.Fragment>
      ))}
      {isFetching && <Card bordered={false} style={{width: 780, maxHeight: 300}} loading={true}/>}
    </InfiniteScroll>


  return cards;
}


export default NewsList;
