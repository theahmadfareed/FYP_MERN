import React from "react";
import "./style.css";

const Card = ({ keywordData }) => {
  console.log(keywordData)
  return (
    <div className="card">
      {keywordData.map((data, index) => (
        <div className="ref" key={index}>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            <p>Keyword: {data.keyword}</p>
            <img src={data.url_to_image} alt="dp" style={{ width: '50px', height: '50px' }} />
            <p>Author: {data.author}</p>
            <p>Title: {data.title}</p>
            <p>Content: {data.content}</p>
            <p>Published-At: {data.published_at.split("T")[0]}</p>
            <p>Sentiment-Label: {data.sentiment_label}</p>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Card;
