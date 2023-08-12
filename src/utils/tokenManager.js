import jwt_decode from "jwt-decode";

const TOKEN_KEY = "TOKEN";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const deleteToken = () => localStorage.removeItem(TOKEN_KEY);

const isAdmin = () => {
  const res = getToken();
  if (!res) return false;
  var decoded = jwt_decode(res);

  return !!decoded.isAdmin;
};

export const tokenManager = { getToken, setToken, deleteToken, isAdmin };
