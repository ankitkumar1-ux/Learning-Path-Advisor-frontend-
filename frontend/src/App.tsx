
import React from "react";
import ResourceTable from "./pages/ResourceTable";
import AIRecommendation from "./pages/AIRecommendation";

const App: React.FC = () => {
  return (
    <div>
      <AIRecommendation />
      <ResourceTable />
    </div>
  );
};

export default App;
