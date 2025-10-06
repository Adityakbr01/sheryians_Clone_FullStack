import globalErrorHandler from "@/middleware/custom/globalErrorHandler";
import routes from "@/routes/index";
import express from "express";
import { defaultMiddlewares } from "./middleware/system/defaultMiddlewares";
import notFoundHandler from "./middleware/custom/notFound";


const app = express();

// Apply all default middlewares
defaultMiddlewares(app);


// Routes
app.use("/api/v1", routes);

// Error Handler
app.use(globalErrorHandler);
app.use(notFoundHandler);
export default app;
