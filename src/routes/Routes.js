import { BrowserRouter, Routes as RRDR, Route } from "react-router-dom";

import LoginPage from "pages/Login.page";
import UsersPage from "pages/Users.page";
import RolesPage from "pages/Roles.page";
import DocumentsPage from "pages/Documents.page";
import CategoriesPage from "pages/Categories.page";
import { Layout } from "components";

export const Routes = () => {
  return (
    <BrowserRouter>
      <RRDR>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
      </RRDR>
    </BrowserRouter>
  );
};
