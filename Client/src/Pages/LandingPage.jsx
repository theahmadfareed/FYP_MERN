import axios from "axios";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [backendData, setBackendData] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/root");
        setBackendData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Landing Page</h1>
      <h1 style={{ textAlign: 'center' }}>{backendData.data}</h1>
    </div>
  );
}
