import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportData from "./MyDocument";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Reports = () => {
  const [searches, setSearches] = useState([]);
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

  const [selectedProjects, setSelectedProjects] = useState([]);
  const handleCheckboxChange = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects((prevSelected) => prevSelected.filter((id) => id !== projectId));
    } else {
      if (selectedProjects.length === 0) {
        setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
      } else {
        alert("You can only select 1 project for a report.");
      }
    }
  };

  const ref = useRef();

  const handleDownloadPdf = () => {
    const targetElement = ref.current;

    html2canvas(targetElement, { scale: 2 }).then((canvas) => {
      const dataURL = canvas.toDataURL();
      const pdf = new jsPDF("p", "mm", "a0");
      pdf.addImage(dataURL, "JPEG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save("report.pdf");
    });
  };

  return (
    <div style={{ backgroundColor: "pink", textAlign: "center" }}>
      {searches.map((search, i) => (
        <div key={search._id}>
          <input
            type="checkbox"
            checked={selectedProjects.includes(search._id)}
            onChange={() => handleCheckboxChange(search._id)}
          />
          <Link to={`/project-details/${search._id}`}>
            <b style={{ marginTop: "10px" }}>
              <span>{search.searched_keywords}</span>&emsp;
              <span>{search.createdAt.split("T")[0]}</span>
            </b>
          </Link>
        </div>
      ))}
      <button onClick={handleDownloadPdf} style={{ marginTop: "15px" }}>
        Download PDF
      </button>
      <div ref={ref} style={{ marginTop: "30px" }}>
        {selectedProjects.length === 1 && <ReportData data={selectedProjects[0]} />}
      </div>
    </div>
  );
};

export default Reports;
