import request from "api/request";

export const role = {
  list: () => request.get("/roles"),
};
