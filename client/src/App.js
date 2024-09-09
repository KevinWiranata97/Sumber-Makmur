
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./views/Products/ProductViews";
import LoginViews from "./views/Login/LoginViews";
import Unit from './views/units/unit';
import Storage from './views/Storages/StorageViews';
import Area from './views/Areas/area'
import Expedition from './views/Expeditions/expedition'
import Customer from './views/Customers/CustomerViews'
function App() {
  return (
    <Routes>
      {/* <Route Route path="/" element={renderLoginOrDashboard()} /> */}
      <Route Route path="/" element={<Home />} />
      <Route Route path="/units" element={<Unit/>} />
      <Route Route path="/storages" element={<Storage/>} />
      <Route Route path="/areas" element={<Area/>} />
      <Route Route path="/expeditions" element={<Expedition/>} />
      <Route Route path="/customers" element={<Customer/>} />
      <Route Route path="/login" element={<LoginViews />} />
    </Routes>
  );
}

export default App;
