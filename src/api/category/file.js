import request from "api/request";

export const file = {
  get: (filename) => request.get("/uploads/" + filename),
};
