var unirest = require("unirest"); 
var cloudinary = require("cloudinary").v2;
var express = require('express')
  , cors = require('cors')
  , app = express();
const corsOptions = {
  origin: true,
  credentials: true
};

var readFile=function(req, res){
  var fs = require('fs');
  var returnData = {};

  fs.readFile('C:\Users\danie\Downloads\Westworld.mp3', function(err, file){
      var base64File = new Buffer(file, 'binary').toString('base64');
console.log(file);
      returnData.fileContent = base64File;

      res.json(returnData);
  });
}




//const multer = require('multer');
var bodyParser = require("body-parser");
const jsdom = require("jsdom");
const { window } = new jsdom.JSDOM(`...`);
var $ = require("jquery")(window);
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

cloudinary.config({
  cloud_name: 'dkqvnprcj',
  api_key: '756886954695832',
  api_secret: '8ESQHQSTHNzYuuvwPxivCuzSwHU'
});

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
};
  next();
}
String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

app.use(allowCrossDomain);

app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes

app.get("/", function (req, res) {

  res.render("FaceApp.ejs");
});


// SET STORAGE(if needed)
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({ storage: storage })
*/
app.post('/submit', function (req, res) {

  console.log("Inside submit");
  detailsFromApi.forEach(function (element) {
    console.log(element);
  });
  res.render("image", { url: url, detailsFromApi: detailsFromApi });
  res.end();

});

app.post('/upload', function (req, res) {
  req.setTimeout(500000);
  

  
  console.log("inside post");
  console.log(req.body.your_data);


  if (req.body.your_data) {

    //var secondrequestFromApi = unirest("POST", "https://api-us.faceplusplus.com/facepp/v1/face/thousandlandmark");
    var requestFromApi = unirest("POST", "https://faceplusplus-faceplusplus.p.rapidapi.com/facepp/v3/detect");

    console.log("inside if req.body.your_data");
    console.log("original url is " +req.body.your_data)
    var MAX_WIDTH = 1000;
    var MAX_HEIGHT = 1000;
    var width = (req.body.width);
    var height = (req.body.height);

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }

    let url_ = req.body.your_data;
    var n = url_.indexOf("upload");
    var resizeParameters = "/w_"+Math.round(width)+",h_"+Math.round(height)+",c_scale"
   url_ = url_.splice(n+6, 0, resizeParameters);//n + upload
   console.log("new url_ = " + url_);
    

    requestFromApi.query({
      return_attributes: "gender,age,smiling,facequality,eyestatus,emotion,ethnicity,beauty,skinstatus",
      return_landmark : "2",
      image_url: url_
    });

    requestFromApi.headers({
      "x-rapidapi-host": "faceplusplus-faceplusplus.p.rapidapi.com",
      "x-rapidapi-key": "9dd7fa4266mshf1c29ba307ecf2dp1bb1dajsna431d00b6273",
      "content-type": "application/x-www-form-urlencoded"
    });

    requestFromApi.form({});

    requestFromApi.end(function (result) {
      if (result.error) throw result.error;

      else {
        console.log("i am inside end");
        let detailsFromApi_ = JSON.parse(JSON.stringify(result.body.faces));

        detailsFromApi_.forEach(function (element) {
          console.log(element);
        });

          global.detailsFromApi = detailsFromApi_;
         global.url = url_;
/*
          secondrequestFromApi.query({
            api_key : "5hMTiSrwjcK1QY-dlqbh94430XBwiiU0	",
            api_secret : "gQiWxwY7RtJm8ALC8g_22wM5phvQxMVD",
            return_landmark: "1",
            image_url : global.url
          });

          secondrequestFromApi.end(function(result){
            if (result.error) console.log(result.error);

else console.log(result);console.log("inside second request end");

          });
*/

          
          res.end();
        }
        });

        
      
    
  } else alert(" Try a different photo or tell Daniel about it :)");
});







var server = app.listen(port, function(){
  console.log('CORS-enabled web server listening on port 8080');
   
});
server.setTimeout(500000);
