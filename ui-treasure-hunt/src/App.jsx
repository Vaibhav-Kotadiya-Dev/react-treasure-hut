// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import Users from './pages/user';
import SuccessPage from './pages/success';
// import Questions from './pages/Questions';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/register" element={<Users />} />
        {/* <Route path="/questions" element={<Questions />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

