import cors from "cors"
import express from "express";
import {userRoute} from "./routes/userRoutes"
const app=express()

app.use(express.json()); 

app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use("/api/users", userRoute);

  

export {app}