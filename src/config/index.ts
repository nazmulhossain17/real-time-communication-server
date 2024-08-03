import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.SECRET_TOKEN) {
  throw new Error("SECRET_TOKEN is not defined in the environment variables");
}

console.log("Environment Variables Loaded");

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.SECRET_TOKEN,
};
