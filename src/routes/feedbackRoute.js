const { Router } = require("express");
const { feedbackcontroller } = require("../controllers/FeedbackController");

const feedbackroute = Router();

feedbackroute.post("/feedbackAI", feedbackcontroller);

module.exports = feedbackroute;