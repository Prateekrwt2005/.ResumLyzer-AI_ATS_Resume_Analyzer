import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Analyze from "./pages/Analyze";
import Review from "./pages/Review";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/review" element={<Review />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/review"
  element={
    <ProtectedRoute>
      <Review />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
  useEffect(() => {
  localStorage.removeItem("token");
}, []);
}
