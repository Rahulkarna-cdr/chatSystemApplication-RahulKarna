import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import "./styles/App.css";
import "./styles/layout.css";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
