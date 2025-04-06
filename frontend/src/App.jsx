import { CContainer } from "@coreui/react";
import { Routes, Route, NavLink } from "react-router-dom";
import LogForm from "./components/LogForm";
import Workspace from "./components/Workspace";
import { CNavbar, CNavbarBrand, CImage, CNav, CNavItem, CNavbarToggler } from "@coreui/react";
import { useState } from "react";
const App = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <CNavbar expand="lg" className="bg-body-tertiary" placement="sticky-top">
        <CContainer breakpoint="md">
          <NavLink to="/">
            <CImage height={35} width={145} src="/src/assets/log_buddy.png" />
          </NavLink>
          <CNavbarToggler aria-label="Toggle navigation" aria-expanded={visible} onClick={() => setVisible(!visible)} />
          <CNav variant="underline-border">
            <CNavItem>
              <NavLink className="nav-link" to="/workspace"> Workspace</NavLink>
            </CNavItem>
          </CNav>
        </CContainer>
      </CNavbar>
      <CContainer className="mt-4" fluid>
        <Routes>
          <Route path="/" element={<LogForm />}></Route>
          <Route path="/workspace" element={<Workspace />}></Route>
        </Routes>
      </CContainer>
    </>
  );
};

export default App;
