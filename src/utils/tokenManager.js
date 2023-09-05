import jwt_decode from "jwt-decode";

const TOKEN_KEY = "TOKEN";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const userIdToken = () => {
  const res = getToken();
  if (!res) return false;
  var decoded = jwt_decode(res);
  return decoded.id;
};

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

const getDocumentFilename = (token) => {
  var decoded = jwt_decode(token);
  console.log(decoded)
  console.log(decoded.filename)
  return decoded.filename;
};

export const tokenManager = {
  getToken,
  setToken,
  deleteToken,
  isAdmin,
  userIdToken,
  getDocumentFilename
};
