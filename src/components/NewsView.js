import React from 'react';
import { Typography, Button} from "antd";
import {convertToNewsDate} from "../util";

import { LeftOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;


const NewsView = ({ news, onBack }) => {
  return (
    <div>
      <Button onClick={() => onBack()} shape="circle" icon={<LeftOutlined />} size="large" style={{ marginBottom: 10 }} />
    <div style={{width: 760, marginRight: 40 }}>
      <Title level={2}> {news.title} </Title>
      <Paragraph>
        {news.description}
      </Paragraph>
      <div style={{ marginBottom: 40 }}>
      <Text strong>{news.source.name}</Text><br />
      <Text>{convertToNewsDate(news.publishedAt)}</Text>
      </div>
      <div style={{ width: '100%', backgroundColor: '#efefef', textAlign: 'center'}}>
        <img className="app-icon" src={news.urlToImage} height="300" />
      </div>
      <Paragraph style={{ marginTop: 30 }}>
        {news.content}
      </Paragraph>

      <Button type="primary" size="large" style={{ margin: 'auto', display: 'block' }} onClick={() => {window.open(news.url,'_blank','resizable=yes')}}>
        Read Full Article
      </Button>
    </div>
    </div>
  )
};

export default NewsView;
