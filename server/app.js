require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("../public"));
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);

  const apiKey = process.env.API_KEY;
  const id = process.env.UNIQUE_ID;

  console.log("API_KEY:", process.env.API_KEY);
  console.log("UNIQUE_ID:", process.env.UNIQUE_ID);

  const url = `https:/us14.api.mailchimp.com/3.0/lists/${id}`;

  const options = {
    method: "POST",
    auth: `devclinton:${apiKey}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "../public/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "../public/failure.html"));
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(3000, () => console.log("App is running on Port 3000"));
