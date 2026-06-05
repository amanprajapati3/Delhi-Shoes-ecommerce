import multer from "multer";

// Store Files Temporarily
const storage = multer.diskStorage({});

// File Filter
const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    file.mimetype.startsWith("image")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files allowed"),
      false
    );
  }
};

// Upload Middleware
const upload = multer({
  storage,
  fileFilter,
});

export default upload;