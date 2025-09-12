const multer = require("multer");

const storage = multer.memoryStorage(); // file ko memory buffer me rakhega
const upload = multer({ storage });

module.exports = upload;
