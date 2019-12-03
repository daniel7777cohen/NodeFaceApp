var unirest = require("unirest");
var cloudinary = require("cloudinary").v2;
var express = require('express')
  , cors = require('cors')
  , app = express();
const corsOptions = {
  origin: true,
  credentials: true
};
//const multer = require('multer');
var bodyParser = require("body-parser");
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

var allowCrossDomain = function (req, res, next) {
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
app.use(allowCrossDomain);
app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes

String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

app.get("/", function (req, res) {
  
  var fs = require('fs');
  var obj = fs.readFileSync('NewDictionary.txt', 'utf8');//read dictionary of 'token' : 'url'
  global.dictionary = JSON.parse(obj);
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
  res.render("image", { url: url, detailsFromApi: detailsFromApi,animal:animal,confidence:confidence });
  res.end();

});

app.post('/upload', function (req, res) {
  req.setTimeout(500000);
  console.log("inside post");
  console.log(req.body.your_data);

  if (req.body.your_data) {

  var facepp = require('face-plusplus-node');
  facepp.setApiKey('5hMTiSrwjcK1QY-dlqbh94430XBwiiU0');
  facepp.setApiSecret('gQiWxwY7RtJm8ALC8g_22wM5phvQxMVD');


    var requestFromApi = unirest("POST", "https://faceplusplus-faceplusplus.p.rapidapi.com/facepp/v3/detect");

    console.log("inside if req.body.your_data");
    console.log("original url is " + req.body.your_data)
    var MAX_WIDTH = 1000;
    var MAX_HEIGHT = 1000;
    var width = (req.body.width);
    var height = (req.body.height);
//compression
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
    var resizeParameters = "/w_" + Math.round(width) + ",h_" + Math.round(height) + ",c_scale"
    url_ = url_.splice(n + 6, 0, resizeParameters);//n + upload
    console.log("new url_ = " + url_);



    requestFromApi.query({
      return_attributes: "gender,age,smiling,facequality,eyestatus,emotion,ethnicity,beauty,skinstatus",
      return_landmark: "2",
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
        
       console.log("getting inside parameters");
//for Search Api
var parameters = {
  image_url : url_,
  faceset_token : '0369b95b7dec263e2b5f022a2600a0e4',

};
facepp.post('/search', parameters, function (err, res) {
  if(err)
  {
    console.log(err);
  }

  else {
    
      global.animal = dictionary[res.results[0].face_token];//get url from local dictionary, using the recent created token from client.
      global.confidence = res.results[0].confidence;
  
  }

});

        res.end();
      }
    });




  } else alert(" Try a different photo or tell Daniel about it :)");
});







var server = app.listen(port, function () {
  console.log('CORS-enabled web server listening on port 8080');

});
server.setTimeout(500000);
