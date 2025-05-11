import AdminNavbar from '../../components/admin-navbar';

const PrivateLayout = ({ children }) => (
  <div>
    <AdminNavbar />
    <div>{children}</div>
  </div>
);

export default PrivateLayout;
