import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddUpgrade from "./pages/AddUpgrade";
import Home from "./pages/Home";
import NavBar from "./NavBar";

function App() {
  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddUpgrade />} />
      </Routes>
    </Router>
  );
}

export default App;
