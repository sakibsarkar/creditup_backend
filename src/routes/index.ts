import express from "express";
import { authRoutes } from "./auth.route";
import { googleApiRoutes } from "./googleApi.route";
const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/sheet",
    route: googleApiRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
