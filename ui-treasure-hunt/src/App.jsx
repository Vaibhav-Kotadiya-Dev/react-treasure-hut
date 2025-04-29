// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import Users from './pages/user';
import SuccessPage from './pages/success';
import AdminUserTable from './pages/admin-user-table';
import AdminLogin from './pages/admin-login';
// import Questions from './pages/Questions';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/register" element={<Users />} />
        <Route path="/admin/users" element={<AdminUserTable />} />
        <Route path="/admin/login" element={<AdminLogin />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

