const TOKEN_KEY = "TOKEN";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  console.log(token);
  localStorage.setItem(TOKEN_KEY, token);
};

const deleteToken = () => localStorage.removeItem(TOKEN_KEY);

export const tokenManager = { getToken, setToken, deleteToken };
