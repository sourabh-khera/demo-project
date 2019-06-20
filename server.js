var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');

app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/image/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
});

var upload = multer({ storage: storage }).single('organization_logo');

var uploadimage = multer({ storage: storage }).single('file_attachment_attachment');


app.post('/upload',function(req, res) {
    
    console.log(" i am in upload");
    upload(req, res, function (err) {

        console.log(err);
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});

app.post('/uploadimage',function(req, res) {

    console.log("i am in  uploadimage");
    
     
    uploadimage(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

      console.log(err+ " "+ res + req);

    })

});

app.listen(8000, function() {

    console.log('App running on port 8000');

});