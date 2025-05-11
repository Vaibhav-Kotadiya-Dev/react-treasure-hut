import Navbar from '../components/nav-bar';
import Footer from '../components/footer';

const PublicLayout = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    <Navbar />
    <div style={{ flexGrow: 1 }}>{children}</div>
    <Footer />
  </div>
);

export default PublicLayout;
