
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./views/products";
import LoginViews from "./views/login";
function App() {
  return (
    <Routes>
      {/* <Route Route path="/" element={renderLoginOrDashboard()} /> */}
      <Route Route path="/" element={<Home />} />
      <Route Route path="/login" element={<LoginViews />} />
    </Routes>
  );
}

export default App;
