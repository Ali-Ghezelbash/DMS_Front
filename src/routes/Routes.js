import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes as RRDR,
} from "react-router-dom";

import { Layout } from "components";
import CategoriesPage from "pages/Categories.page";
import DocumentsPage from "pages/Documents.page";
import LoginPage from "pages/Login.page";
import RolesPage from "pages/Roles.page";
import UsersPage from "pages/Users.page";
import { tokenManager } from "utils";

const ProtectedRoute = () => {
  const isLoggedIn = tokenManager.getToken();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export const Routes = () => {
  return (
    <BrowserRouter>
      <RRDR>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Route>
        </Route>
      </RRDR>
    </BrowserRouter>
  );
};
