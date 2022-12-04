import { useNavigate, Link } from 'react-router-dom';


const SideNav = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
    };
  
    return (
      <div className="sidenav">
        <Link to="/account">Order History</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/recommendations">Recommendations</Link>
        <button onClick={handleLogout} className="logout-button" style={{ position: "absolute", bottom: 0 }}>Logout</button>    </div>
    );
  };

export default SideNav;