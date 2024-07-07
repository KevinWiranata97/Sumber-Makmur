
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./views/Products/ProductViews";
import LoginViews from "./views/Login/LoginViews";
import Unit from './views/unit';
import Storage from './views/Storages/StorageViews';
function App() {
  return (
    <Routes>
      {/* <Route Route path="/" element={renderLoginOrDashboard()} /> */}
      <Route Route path="/" element={<Home />} />
      <Route Route path="/units" element={<Unit/>} />
      <Route Route path="/storages" element={<Storage/>} />
      <Route Route path="/login" element={<LoginViews />} />
    </Routes>
  );
}

export default App;
