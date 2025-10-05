import app from "./app";
import connectDB from "@/db/db";
import _config from "./config";


const PORT = _config.ENV.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
