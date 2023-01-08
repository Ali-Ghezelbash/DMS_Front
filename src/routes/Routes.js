import { BrowserRouter, Routes as RRDR, Route } from "react-router-dom";

import LoginPage from "pages/Login.page";
import UsersPage from "pages/Users.pge";

export const Routes = () => {
  return (
    <BrowserRouter>
      <RRDR>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
      </RRDR>
    </BrowserRouter>
  );
};
