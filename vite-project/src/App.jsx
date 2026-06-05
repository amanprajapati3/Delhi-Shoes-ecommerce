import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // change to "auto" if you don't want smooth scrolling
    });
  }, [location.pathname]);

  // Hide header/footer on dashboard routes
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Header />}

      <Outlet />

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;