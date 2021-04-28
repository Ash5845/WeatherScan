if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const ejsMate = require("ejs-mate");
const express = require("express");
const path = require("path");
const axios = require("axios");
const apiToken = process.env.RapidAPI_KEY

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
    let searchQuery = req.query.location;
    if(searchQuery){
    } else {
      searchQuery = "manchester"
    }
    const options = {
      method: "GET",
      url:
        `https://community-open-weather-map.p.rapidapi.com/find?q=${searchQuery}&cnt=5&mode=null&lon=0&type=link%2C%20accurate&lat=0&units=metric`,
      headers: {
        "x-rapidapi-key": apiToken,
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      },
    };
    const data = await axios.request(options)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    const weatherData = (data.data.list[0]);
    if (!weatherData) {
      res.redirect("errorpage");
    }
    res.render("home", {weatherData})
})

app.get("*", (req, res) => {
  res.render("Error")
});

app.get("errorpage", (req, res) => {
  res.render("Error")
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});