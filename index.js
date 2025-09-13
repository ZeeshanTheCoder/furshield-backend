const { configDotenv } = require("dotenv");
const express = require("express");
const db_Connection = require("./src/config/db_Connection.js");
const userRouter = require("./src/routes/userRoute.js");
const cookieParser = require("cookie-parser");
const route = require("./src/routes/authRoute.js");
const petsrouter = require("./src/routes/petRoute.js");
const healthrecordRouter = require("./src/routes/healthrecordRoute.js");
const productRouter = require("./src/routes/productRoute.js");
const adoptablePetsRoute = require("./src/routes/adoptablePetsRoute.js");
const adoptionRequestRoute = require("./src/routes/adoptionRequestRoute.js");
const appointmentRoute = require("./src/routes/appointmentRoute.js");
const careContentRoute = require("./src/routes/careContentRoute.js");
const cartRoute = require("./src/routes/cartRoute.js");
const notificationRoute = require("./src/routes/notificationRoute.js");
const reviewAndRatingRoute = require("./src/routes/reviewAndRatingRoute.js");
const treatmentLogRoute = require("./src/routes/treatmentLogRoute.js");
const vetRoute = require("./src/routes/vetRoute.js");
const cors = require("cors");
const feedbackroute = require("./src/routes/feedbackRoute.js");

configDotenv();
db_Connection();
const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Only allow your Vite dev server
    credentials: true, // If you use cookies/auth headers
  })
);

// routes
app.use("/user", userRouter);
app.use("/auth", route);
app.use("/pets", petsrouter);
app.use("/health", healthrecordRouter);
app.use("/product", productRouter);
app.use("/adoptable", adoptablePetsRoute);
app.use("/adoption-request", adoptionRequestRoute);
app.use("/appointment", appointmentRoute);
app.use("/care-content", careContentRoute);
app.use("/cart", cartRoute);
app.use("/notifications", notificationRoute);
app.use("/reviews-rating", reviewAndRatingRoute);
app.use("/treatment", treatmentLogRoute);
app.use("/vet", vetRoute);
app.use("/ai", feedbackroute);

app.listen(PORT, () => console.log(`Server Is Running On Port No:${PORT}`));
