import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      {/* Acá puede ir un NavBar, SideMenu, etc */}
      <Outlet />;
    </>
  );
};

export default Layout;
