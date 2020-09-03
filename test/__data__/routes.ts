import { Request, Response, Next } from "restify";

function getUsers(req: Request, res: Response, next: Next): Response {
  return res.send({ users: [] });
}

function getUser(req: Request, res: Response, next: Next): Response {
  return res.send({ user: {} });
}

function createUser(req: Request, res: Response, next: Next): Response {
  return res.send({ user: {} });
}

function editUser(req: Request, res: Response, next: Next): Response {
  return res.send({ user: {}, updated: true });
}

function deleteUser(req: Request, res: Response, next: Next): Response {
  return res.send({ user: {}, deleted: true });
}

export const routes = [
  {
    match: "/",
    method: "get",
    action: getUsers
  },
  {
    match: "/:id",
    method: "get",
    action: getUser
  },
  {
    match: "/:id/edit",
    method: "put",
    action: editUser
  },
  {
    match: "/:id/delete",
    method: "delete",
    action: deleteUser
  },
  {
    match: "/",
    method: "post",
    action: createUser
  }
];