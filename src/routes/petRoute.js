const express = require("express");
const {
  petscreate,
  updatePet,
  deletePet,
  getPetsByOwner,
  petsfetchbyid,
} = require("../controllers/petController.js");
const verifyToken = require("../Middlwares/verifytokenMiddleware");
const upload = require("../Middlwares/Upload.js");
const petsrouter = express.Router();

petsrouter.post(
  "/petscreate",
  verifyToken,
  upload.array("gallery", 4),
  petscreate
);

petsrouter.put(
  "/petsupdate/:id",
  verifyToken,
  upload.array("gallery", 4),
  updatePet
);

petsrouter.delete("/petsdelete/:id", verifyToken, deletePet);

petsrouter.get("/fetchpetsbyowner", verifyToken, getPetsByOwner);
petsrouter.get("/petsfetchbyid/:id", verifyToken, petsfetchbyid);

module.exports = petsrouter;
