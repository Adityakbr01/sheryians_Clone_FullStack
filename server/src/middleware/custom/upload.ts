import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "..", "uploads", "courses");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
    },
});

export const upload = multer({ storage });
