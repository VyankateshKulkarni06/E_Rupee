import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./login";
import PaymentGateway from "./payment_gateway";
import Dash from "./dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/dashboard" element={<Dash />} />
      </Routes>
    </Router>
  );
}

export default App;
