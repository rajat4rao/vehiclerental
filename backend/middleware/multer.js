const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carUploadStorage = (req, res, next) => {
  console.log("request body",req.body)
  const tempDir = "temp_uploads/"; // Ensure this directory exists

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      console.log("Filename callback executed!");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
      // Store the filename in the request object for later access
      if (!req.uploadedFilenames) {
        req.uploadedFilenames = [];
      }
      req.uploadedFilenames.push(filename);

    },
  });

  const upload = multer({ storage }).any();

  upload(req, res, async function (err) {
    console.log(req.body.type);
    if (err instanceof multer.MulterError) {
      return res.status(500).send({ error: "Multer Error" });
    } else if (err) {
      console.log(err)
      return res.status(500).send({ error: "Unknown Error" });
    }
    let userDir;
    const filesToDelete = {};

    if(req.body.type==="profile_image"){
      userDir = `uploads/images/${req.body.sid}`;
    } else if(req.body.type==="user_profile_image") {
      userDir = `uploads/user_images/${req.body.uid}`;
    } else {
      userDir = `uploads/${req.body.sid}/${req.body.car_no}`;
    }
    console.log(req.files)
    for (const file of req.files) { // Iterate over the array of files
      const fieldname = file.fieldname;
      filesToDelete[fieldname] = getFilesToDelete(userDir, fieldname);
    } 
    console.log("filestodelete",filesToDelete)

    fs.mkdirSync(userDir, { recursive: true });


    try {
        for (const fieldname in filesToDelete) { // Iterate through fieldnames
          await Promise.all(
              filesToDelete[fieldname].map(async (filename) => { // Access filenames by fieldname
                  const filePath = path.join(userDir, filename);
                  try {
                    await fs.promises.unlink(filePath); 
                    console.log("File deleted successfully:", filePath);
                } catch (fileDeleteError) {
                    console.error("Error deleting file:", filePath, fileDeleteError);
                }
              })
          );
      }

      await Promise.all(
        req.files.map(async (file) => {
          const oldPath = file.path;
          const newPath = path.join(userDir, file.filename);
          await fs.promises.rename(oldPath, newPath);
          file.path = newPath;
          file.destination = userDir;
        })
      );
      next();
    } catch (moveError) {
      console.error("Error moving files:", moveError);
      return res.status(500).json({ error: "Failed to move uploaded files" });
    }
  });
};



function getFilesToDelete(directory, fieldname) {
  try{
      return fs.readdirSync(directory).filter(file => file.startsWith(fieldname));
  } catch(err){
      console.log("error",err);
      return []
  }

}

module.exports = carUploadStorage;