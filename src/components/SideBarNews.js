import React from 'react';
import {Card, Typography} from "antd";
import {convertToNewsDate} from "../util";

const { Title, Text } = Typography;

const SideBarNews = ({ news, onNewsClicked }) => {
  return (
    <Card title="Top News" style={{ marginTop: '20px', width: '100%', height: 'fit-content' }} loading={false}>
      <div style={{ display: 'flex' }}>
        <div>
          <div className="app-meta">
            {news.map((a,i) => i < 10 ?
              <Card hoverable bordered={false} key={i} onClick={() => onNewsClicked(a)}>
              <Title level={4}>{a.title} </Title>
              <Text style={{ '&:hover': { textDecoration: 'underline' } }} strong>{a.source.name}</Text><br />
              <Text>{convertToNewsDate(a.publishedAt)}</Text><hr />
            </Card>:null)}
          </div>
        </div>
      </div>
    </Card>
  )
};


export default SideBarNews;
