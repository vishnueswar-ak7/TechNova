const multer = require('multer');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Multer with memoryStorage — images are NEVER written to disk.
 * They live only in req.file.buffer for the duration of the request.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        Object.assign(new Error('Only JPEG, PNG, and WEBP images are accepted.'), {
          status: 415,
          userMessage: 'That file type is not supported. Please upload a JPEG, PNG, or WEBP screenshot.',
        })
      );
    }
  },
});

module.exports = { upload };
