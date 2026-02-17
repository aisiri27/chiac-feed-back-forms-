import { useEffect, useState } from "react";
import "./App.css";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import { dummyAnalyticsData } from "./data/dummyAnalyticsData";
import { fetchAnalyticsOverview } from "./data/fetchAnalyticsData";

function App() {
  const [data, setData] = useState(dummyAnalyticsData);
  const [source, setSource] = useState("demo");
  const [statusMessage, setStatusMessage] = useState("Loading analytics...");

  useEffect(() => {
    let isMounted = true;
    let currentAbortController = null;

    const loadAnalytics = async () => {
      if (currentAbortController) {
        currentAbortController.abort();
      }

      currentAbortController = new AbortController();

      try {
        const apiData = await fetchAnalyticsOverview({ signal: currentAbortController.signal });
        if (!isMounted) return;
        setData(apiData);
        setSource("api");
        setStatusMessage("");
      } catch {
        if (!isMounted) return;
        setData(dummyAnalyticsData);
        setSource("demo");
        setStatusMessage("API unavailable. Showing demo analytics data.");
      }
    };

    loadAnalytics();
    const intervalId = window.setInterval(loadAnalytics, 30000);

    return () => {
      isMounted = false;
      if (currentAbortController) {
        currentAbortController.abort();
      }
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {statusMessage ? (
        <p className="status-banner" data-testid="status-banner">
          {statusMessage}
        </p>
      ) : null}
      <AnalyticsDashboard data={data} source={source} />
    </>
  );
}

export default App;
