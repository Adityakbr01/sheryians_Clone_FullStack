import globalErrorHandler from "@/middleware/custom/globalErrorHandler";
import routes from "@/routes/index";
import express from "express";
import path from "path";
import { defaultMiddlewares } from "./middleware/system/defaultMiddlewares";
import notFoundHandler from "./middleware/custom/notFound";
import { fileURLToPath } from "url";


const app = express();

// Apply all default middlewares
defaultMiddlewares(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files
app.use(
    "/uploads/courses",
    express.static(path.join(__dirname, "..", "..", "uploads", "courses"))
);


// Routes
app.use("/api/v1", routes);

// Error Handler
app.use(globalErrorHandler);
app.use(notFoundHandler);
export default app;
