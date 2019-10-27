var unirest = require("unirest");
var cloudinary = require("cloudinary").v2;
var express = require('express')
  , cors = require('cors')
  , app = express();
const corsOptions = {
  origin: true,
  credentials: true
}
const multer = require('multer');
const path = require("path");
var bodyParser = require("body-parser");

const jsdom = require("jsdom");
const { window } = new jsdom.JSDOM(`...`);
var $ = require("jquery")(window);
var FileReader = require('filereader');
const tinify = require("tinify");
tinify.key = "nrJWPWtXp04GWYcY7RPv1vRJ1m8znW41";
var urlencodedParser = bodyParser.urlencoded({ extended: true });
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

app.get("/", function (req, res) {
  res.render("FaceApp.ejs");
});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({ storage: storage })


function compress(e) {
  const width = 500;
  const height = 300;
  const fileName = e.filename;
  const reader = new FileReader();
  reader.readAsDataURL(e);
  reader.onload = event => {
    const img = new Image();
    img.src = event.target.result;

    img.onload = () => {
      const elem = document.createElement('canvas');
      elem.width = width;
      elem.height = height;
      const ctx = elem.getContext('2d');
      // img.width and img.height will contain the original dimensions
      console.log(img.width);

      ctx.drawImage(img, 0, 1600, 1068, height);
      ctx.canvas.toBlob((blob) => {
        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });


      }, 'image/jpeg', 1); return file;

    },


      reader.onerror = error => console.log(error);

  };
};

function callback(file) {
  const source = tinify.fromFile(req.file.path);
  const resized = source.resize({
    method: "fit",
    width: 1600,
    height: 1000
  });
  resized.toFile(resized.png);
};


app.post('/submit', function (req, res) {

  console.log("Inside submit");
  detailsFromApi.forEach(function (element) {
    console.log(element);
  });
        res.render("image", { url: url, detailsFromApi: detailsFromApi });


      });

app.post('/upload', function (req, res) {
 
  console.log("inside post");

  console.log(req.body.your_data);


  //req.file = compress(req.file);

  //tinify.fromFile(req.file.path).toFile("optimized.png");


  var requestFromApi = unirest("POST", "https://faceplusplus-faceplusplus.p.rapidapi.com/facepp/v3/detect");
  if (req.body.your_data) {
    console.log("inside if req.body.your_data");
    console.log(req.body.your_data)
    let url_ = req.body.your_data;

   
    requestFromApi.query({
      return_attributes: "gender,age,smiling,facequality,eyestatus,emotion,ethnicity,beauty,skinstatus",
      image_url: url_
    });

    requestFromApi.headers({
      "x-rapidapi-host": "faceplusplus-faceplusplus.p.rapidapi.com",
      "x-rapidapi-key": "9dd7fa4266mshf1c29ba307ecf2dp1bb1dajsna431d00b6273",
      "content-type": "application/x-www-form-urlencoded"
    });

    requestFromApi.form({});

    requestFromApi.end(function (result) {
      if (result.error) throw new Error(result.error);
      else {
        console.log("i am inside end");
        let detailsFromApi_ = JSON.parse(JSON.stringify(result.body.faces));
      //  detailsFromApi_.forEach(function (element) {
          //console.log(element);
       // });
       detailsFromApi_.forEach(function (element) {
        console.log(element);

         global.detailsFromApi = detailsFromApi_;
         global.url = url_;
        //res.render("image", { url: url, detailsFromApi: detailsFromApi });
       // return res.render("image", { url: url, detailsFromApi: detailsFromApi});
       
      });

      }


    });

  } else throw error;

});
app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});







