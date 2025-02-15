import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/main/Home";
import About from "./components/main/About";
import Skills from "./components/main/Skills";
import Project from "./components/main/Project";
import Contact from "./components/main/Contact";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/project" element={<Project />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
