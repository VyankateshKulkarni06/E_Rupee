import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./login";
import PaymentGateway from "./payment_gateway";
import Dash from "./dashboard";
import PendingRequestsPage from './pending_requests';
import SearchUsername from './Search_username';
import TransactionHistory from "./TransactionHistory";
import ExtraBalance from "./extra_balances";
import ExtraPayment from "./ExtraPayment"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/PendingRequests" element={<PendingRequestsPage/>}/>
        <Route path="/searchUsername" element={<SearchUsername/>}/>
        <Route path ="/Transaction_History" element={<TransactionHistory/>}/>
        <Route path="/ExtraBalances" element={<ExtraBalance/>}/>
        <Route path="/ExtraPayment" element={<ExtraPayment/>}/>
      </Routes>
    </Router>
  );
}

export default App;
