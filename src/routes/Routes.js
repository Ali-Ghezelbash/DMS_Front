import { BrowserRouter, Routes as RRDR, Route } from "react-router-dom";

import LoginPage from "pages/Login.page";
import UsersPage from "pages/Users.page";
import RolesPage from "pages/Roles.page";
import DocumentsPage from "pages/Documents.page";
import { Layout } from "components";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Layout />
      <RRDR>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </RRDR>
    </BrowserRouter>
  );
};
