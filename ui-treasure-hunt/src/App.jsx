import { Routes, Route, useLocation } from "react-router-dom";
import SuccessPage from "./pages/success";
import Navbar from "./components/nav-bar";
import Footer from "./components/footer";
import BookingForm from "./pages/book-now";
import Home from "./pages/home";
import About from "./pages/about";
import { ToastProvider } from "./components/toaster"; // adjust the path if needed
import "./style.css";
import { useEffect } from "react";
const App = () => {
  const location = useLocation();
  useEffect(() => {
    const pageTitles = {
      "/": "",
      "/about": "about",
      "/book-now": "Book now",
      "/success": "success",
    };

    document.title = `Puzzle Panda  ${
      pageTitles[location.pathname] ? `| ${pageTitles[location.pathname]}` : ""
    }`;
  }, [location.pathname]);
  return (
    <ToastProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Navbar />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/success" element={<SuccessPage />} />
            {/* <Route path="/register" element={<Users />} /> */}
            {/* <Route path="/admin/users" element={<AdminUserTable />} />
            <Route path="/admin/login" element={<AdminLogin />} /> */}
            <Route path="/book-now" element={<BookingForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
