import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./style.css";


export default function Dashboard() {
  const [searches, setSearches] = useState([])
  useEffect(() => {
    async function getAllSearches() {
      try {
        const searches_response = await axios.get("/api/dashboard/");
        console.log(searches_response.data)
        setSearches(searches_response.data);
      }
      catch (error) {
        console.log(error);
      }
    }
    getAllSearches();
  }, []);
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Dashboard</h1>
      <ol>
        {searches.map((search, i) => (
          <li key={search._id}>
            <Link to={`/project-details/${search._id}`}>
              <b>
                <span>{search.searched_keywords}</span>&emsp;
                <span>{search.createdAt.split("T")[0]}</span>
              </b>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}