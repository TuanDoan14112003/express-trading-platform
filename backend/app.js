const express = require("express");
const cors = require("cors");
const digitalAssetRouter = require("./src/routes/DigitalAssetRoutes");
const authenticationRouter = require("./src/routes/AuthenticationRoutes");

const port = 8000;
app = express();
app.use(cors());
app.use(express.json());

app.use("/api/assets", digitalAssetRouter);
app.use("/api/auth", authenticationRouter);


app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
