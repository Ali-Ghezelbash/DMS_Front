import request from "api/request";

export const role = {
  list: () => request.get("/roles"),
  create: (body) => request.post("/roles", body),
  update: (body) => request.put("/roles", body),
};
