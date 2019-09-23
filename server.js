const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());

// middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Connect to mongodb
const mongoURI = 'mongodb://localhost:27017/uploadrDB';
mongoose.connect(mongoURI);
app.listen(3000);
console.log("Server running on port 3000");

//Init gfs
let gfs;

var conn = mongoose.connection;
mongoose.connection.once('open', function() {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploadrDB');
  console.log("Connection has been made, now make fireworks...", {useNewUrlParser: true});
}).on('error', function(err) {
  console.log('Connection error:', error);
});

// create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploadrDB'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route POST /upload
// @desc Uploads file to DB
app.post('/api/upload', upload.single('myFile'), (req, res) => {
  //console.log(req);
  res.json({myFile: req.file});
});

// @route GET /files
// @desc Display single file object
app.get('/api/uploads/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // file exists
    return res.json(file);
  })
});

// @route GET/ Display image
// @desc Display image
app.get('/api/image/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // check if image is valid
    if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
      // read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      })
    }
  })})

var imgAddresses = [];


// @route GET/ image addresses
// @desc Returns addresses of all uploaded images
app.get('/api/load', (req, res) => {
  conn.collection('uploadrDB.files').distinct("filename").then((data) => {
    imgAddresses = data;
  });
  res.json(imgAddresses);
});

// @route DELETE/ remove image
// @desc Removes image from db
app.delete('/api/delete/:address', (req, res,) => {
  gfs.remove({filename: req.params.address, root: 'uploadrDB'}, (err, gridStore) => {
    if(err) {
      return res.status(404).json({err: err});
    } else {
      conn.collection('uploadrDB.files').distinct("filename").then((data) => {
        imgAddresses = data;
      });
      return res.json(imgAddresses)
    }
  })
})
