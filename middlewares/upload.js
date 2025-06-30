import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = path.join(process.cwd(), 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    const filename = `${req.user.id}_${Date.now()}.${extension}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: multerConfig,
  limits: {
    fileSize: 2048576,
  },
});

export default upload;
