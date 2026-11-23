import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import initialData from "./portfolio.json";

function Home() {
  const [portfolio, setPortfolio] = useState(initialData);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setPortfolio(data);
      })
      .catch((err) => {
        // Fallback gracefully to bundled portfolio data
        console.warn("API not reachable, using fallback data:", err.message);
      });
  }, []);

  return (
    <div className="portfolio" style={{ maxWidth: "800px", margin: "2rem auto", padding: "1.5rem", fontFamily: "sans-serif" }}>
      <h1>{portfolio?.profile?.name || "My Portfolio"}</h1>
      <h3>{portfolio?.profile?.title}</h3>
      <p>{portfolio?.profile?.bio}</p>
      <pre style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "8px", overflowX: "auto" }}>
        {JSON.stringify(portfolio, null, 2)}
      </pre>
    </div>
  );
}

function NotFound() {
  return <h2 style={{ textAlign: "center", marginTop: "3rem" }}>404 – Page Not Found</h2>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
