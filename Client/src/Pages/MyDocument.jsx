import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "../Components/Chart/LineChart";
import BarChart from "../Components/Chart/BarChart";

export default function ReportData(props) {
  const p_id = props.data;
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    async function handleReportData() {
      try {
        const response = await axios.get(`/api/fetchData/${p_id}/`);
        setProjectData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    handleReportData();
  }, [p_id]);

  // Check if projectData is not null before accessing its properties
  if (projectData === null) {
    return <div>Loading...</div>;
  }

  // // News API data for bar-chart
  const nb1 = projectData.news_sentiments.K1_News_Sentiments;
  const nb2 = projectData.news_sentiments.K2_News_Sentiments;
  const nb3 = projectData.news_sentiments.K3_News_Sentiments;
  // // Reddit API data for bar-chart
  const rb1 = projectData.reddit_sentiments.K1_Reddit_Sentiments;
  const rb2 = projectData.reddit_sentiments.K2_Reddit_Sentiments;
  const rb3 = projectData.reddit_sentiments.K3_Reddit_Sentiments;
  // // News API data for line-chart
  const nl1 = projectData.news_graph_data.K1_News_Graph_Data;
  const nl2 = projectData.news_graph_data.K2_News_Graph_Data;
  const nl3 = projectData.news_graph_data.K3_News_Graph_Data;
  // // Reddit API data for line-chart
  const rl1 = projectData.reddit_graph_data.K1_Reddit_graph_data;
  const rl2 = projectData.reddit_graph_data.K2_Reddit_graph_data;
  const rl3 = projectData.reddit_graph_data.K3_Reddit_graph_data;



  return (
    <div className="report-data" style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ background: "white" }}>News Report</h1>
      <div>
        <div className="news" style={{ display: "flex", justifyContent: "space-evenly", textAlign: "center" }}>
          {nl1 && (
            <div style={{ width: "400px" }}>
              <h1>{nl1.keyword}</h1>
              <LineChart line_data={nl1} />
            </div>
          )}
          {nl2 && (
            <div style={{ width: "400px" }}>
              <h1>{nl2.keyword}</h1>
              <LineChart line_data={nl2} />
            </div>
          )}
          {nl3 && (
            <div style={{ width: "400px" }}>
              <h1>{nl3.keyword}</h1>
              <LineChart line_data={nl3} />
            </div>
          )}
        </div>
        <div className="news" style={{ display: "flex", justifyContent: "space-evenly", textAlign: "center" }}>
          {/* {
            barChartDataNews.map((x) => {
              return (
                <div style={{ width: "400px" }}>
                  <BarChart total_sentiments={x} />
                </div>
              )
            })
          } */}
          {nb1 && (
            <div style={{ width: "400px" }}>
              <h4>{nb1.keyword}</h4>
              <BarChart total_sentiments={nb1.sentiments} />
            </div>
          )}
          {nb2 && (
            <div style={{ width: "400px" }}>
              <h4>{nb2.keyword}</h4>
              <BarChart total_sentiments={nb2.sentiments} />
            </div>
          )}
          {nb3 && (
            <div style={{ width: "400px" }}>
              <h4>{nb3.keyword}</h4>
              <BarChart total_sentiments={nb3.sentiments} />
            </div>
          )}


        </div>
      </div>
      <h1 style={{ background: "white" }}>Reddit Report</h1>
      <div>
        <div className="reddit" style={{ display: "flex", justifyContent: "space-evenly", textAlign: "center" }}>
          {rl1 && (
            <div style={{ width: "400px" }}>
              <h1>{rl1.keyword}</h1>
              <LineChart line_data={rl1} />
            </div>
          )}
          {rl2 && (
            <div style={{ width: "400px" }}>
              <h1>{rl2.keyword}</h1>
              <LineChart line_data={rl2} />
            </div>
          )}
          {rl3 && (
            <div style={{ width: "400px" }}>
              <h1>{rl3.keyword}</h1>
              <LineChart line_data={rl3} />
            </div>
          )}
        </div>
        <div className="reddit" style={{ display: "flex", justifyContent: "space-evenly", textAlign: "center" }}>
          {/* {
            barChartDataReddit.map((x) => {
              return (
                <div style={{ width: "400px" }}>
                  <BarChart total_sentiments={x.sentiments} />
                </div>
              )
            })
          } */}
          {rb1 && (
            <div style={{ width: "400px" }}>
              <h4>{rb1.keyword}</h4>
              <BarChart total_sentiments={rb1.sentiments} />
            </div>
          )}
          {rb2 && (
            <div style={{ width: "400px" }}>
              <h4>{rb2.keyword}</h4>
              <BarChart total_sentiments={rb2.sentiments} />
            </div>
          )}
          {rb3 && (
            <div style={{ width: "400px" }}>
              <h4>{rb3.keyword}</h4>
              <BarChart total_sentiments={rb3.sentiments} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
