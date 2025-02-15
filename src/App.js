import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/main/Main";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
