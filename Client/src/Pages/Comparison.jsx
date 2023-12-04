import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import ComparisonChart from "../Components/Chart/ComparisonChart";
import "./style.css"; // Import your CSS file

export default function Dashboard() {
  const [searches, setSearches] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectSentiments1, setProjectSentiments1] = useState(null);
  const [projectSentiments2, setProjectSentiments2] = useState(null);

  const [projectSearchTerms1, setProjectSearchTerms1] = useState(null);
  const [projectSearchTerms2, setProjectSearchTerms2] = useState(null);

  useEffect(() => {
    async function getAllSearches() {
      try {
        const searches_response = await axios.get("/api/dashboard/");
        setSearches(searches_response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllSearches();
  }, []);

  const handleCheckboxChange = (projectId) => {
    setSelectedProjects((prevSelected) => {
      if (prevSelected.includes(projectId)) {
        return prevSelected.filter((id) => id !== projectId);
      } else {
        return [...prevSelected, projectId];
      }
    });
  };

  const handleCompareProjects = async () => {
    if (selectedProjects.length !== 2) {
      console.log("Please select exactly 2 projects for comparison.");
      return;
    }

    try {
      const [projectId1, projectId2] = selectedProjects;

      const [response1, response2] = await Promise.all([
        axios.get(`/api/fetchData/${projectId1}/`),
        axios.get(`/api/fetchData/${projectId2}/`),
      ]);

      const totalSentiments1 = response1.data.Total_Sentiments;
      const totalSentiments2 = response2.data.Total_Sentiments;

      const searchTerms1 = response1.data.searched_keywords;
      const searchTerms2 = response2.data.searched_keywords;

      setProjectSentiments1(totalSentiments1);
      console.log("Demo-Sentiments-1", totalSentiments1)
      setProjectSentiments2(totalSentiments2);
      console.log("Demo-Sentiments-2", totalSentiments2)
      setProjectSearchTerms1(searchTerms1);
      console.log("Demo-Search-1", searchTerms1)
      setProjectSearchTerms2(searchTerms2);
      console.log("Demo-Search-2", searchTerms2)
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {searches.map((search, i) => (
        <div className="search-item" key={search._id}>
          <input
            type="checkbox"
            checked={selectedProjects.includes(search._id)}
            onChange={() => handleCheckboxChange(search._id)}
          />
          <Link to={`/project-details/${search._id}`}>
            <b>
              <span>{search.searched_keywords}</span>&emsp;
              <span>{search.createdAt.split("T")[0]}</span>
            </b>
          </Link>
        </div>
      ))}
      <button className="compare-button" onClick={handleCompareProjects}>
        Compare Selected Projects
      </button>
      {selectedProjects.length === 2 && (
        <ComparisonChart
          total_sentiments1={projectSentiments1}
          total_sentiments2={projectSentiments2}
          searchTerms1={projectSearchTerms1}
          searchTerms2={projectSearchTerms2}
        />
      )}
    </div>
  );
}
