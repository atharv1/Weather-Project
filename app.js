const express = require("express");
const https = require("https");               // To receive external API


const app = express();
app.use(express.urlencoded({extended:true}));       //To access text that the user types in the input

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});

app.post("/",function(req,res){      // catch the request
  const query = req.body.cityName;
  const apikey= "93ba2157571900552b95ab4a78255ce8";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;
  https.get(url,function(response){
    console.log(response.statusCode);            //in console i.e. in terminal prints status code (200/ 404,etc)

    response.on("data",function(data){    //Getting hold of the data -->(response.on("data"))...,function(data) -> is to use the data which we got
      const weatherData = JSON.parse(data);  // pass the data that we get back in actual JSON
      const temp = weatherData.main.temp;    // Digging through JSON to get data that we want
      const description = weatherData.weather[0].description;
      var icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently "+ description + "</p>");    //We can have more than 1 res.write()
      res.write("<h1>The temperature in " + query + " is " + temp + " degree Celcius</h1>");
      res.write("<img src=" + imageURL + " ></img>");
      res.send();   //We can only have 1 res.send()--> this will call both res.write()
    })
  });
})



app.listen(3000,function(req,res){
  console.log("Server is running on port 3000");
});
