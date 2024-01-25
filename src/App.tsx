import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserDirectory from "./components/UserDirectory"; // Import the UserDirectory c//omponent here
import UserDetails from './components/UserDetails';

function App() {
  return (
    <Router>
      <div className="App">
      <h1 style={{ backgroundColor: 'black', color: 'white' }}>Teachmint Assessment</h1>
        <Routes>
          <Route path="/" element={<UserDirectory />} />
          <Route path="/user-details/:userId" element={<UserDetails />} />
          {/* Add more routes if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
