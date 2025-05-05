import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Users from './pages/user';
import SuccessPage from './pages/success';
// import AdminUserTable from './pages/admin-user-table';
// import AdminLogin from './pages/admin-login';
import Navbar from './components/nav-bar';
import Footer from './components/footer';
import BookingForm from './pages/book-now';
import Home from './pages/home';
import About from './pages/about';
import { ToastProvider } from './components/toaster'; // adjust the path if needed

const App = () => {
  return (
  <ToastProvider>
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            <Route path="/home" element={<Home />}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </ToastProvider>
  );
}

export default App;

