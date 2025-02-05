import React from "react";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import { useParams, useRoutes, useSearchParams } from "react-router-dom";
function App() {
  
  return (
    <div className="root">
      <Login />
    </div>
  );
}

export default App;
