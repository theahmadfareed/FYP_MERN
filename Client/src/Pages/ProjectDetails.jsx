import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "../Components/Chart/LineChart";
import Card from "../Components/Card/Card";
import "./style.css";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const response = await axios.get(`/api/fetchData/${projectId}/`);
        console.log(response.data);
        setProjectData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProjectData();
  }, [projectId]);

  return (
    <div>
      {projectData && (
        <div>
          <LineChart line_data={projectData.graph_data} />
          <br />
          <h2 style={{ textAlign: 'center' }}>{projectData.searched_keywords}</h2>
          <div>
            <Card keywordData={projectData.Data} />
          </div>
        </div>
      )}
    </div>
  );
}
