const mongoose = require('mongoose');
var multer = require('multer');
const User = mongoose.model('User');
const File = mongoose.model('File');
const splitFile = require('split-file');
var uuid = require('uuid');
var fs = require('fs');
var crypto = require('crypto');

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      var newFileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
      cb(null, newFileName);
  }
});

var upload = multer({ //multer settings
              storage: storage
          }).single('file');

module.exports.profileRead = (req, res) => {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    User.findById(req.payload._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};

module.exports.profileFileUpload = (req, res) => {
  upload(req,res,function(err){
      console.log(req.file.path)
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
      var file_data = req.file;

      splitFile.splitFile(file_data.path, 2)
      .then((names) => {
        // console.log(names);
        var key1 = crypto.randomBytes(32);
        var iv1 = crypto.randomBytes(16);
        var cipher1 = crypto.createCipheriv('aes-256-cbc', key1,iv1);
        console.log('')
        var input1 = fs.createReadStream(names[0]);
        var output1 = fs.createWriteStream(names[0]+'.enc');
        input1.pipe(cipher1).pipe(output1);

        // output1.on('finish', function() {
        //   console.log('Encrypted file written to disk!');
        //   var cipher = crypto.createDecipheriv('aes-256-cbc', key1,iv1);
        //   console.log('')
        //   var input = fs.createReadStream(names[0]+'.enc');
        //   var output = fs.createWriteStream(names[0]+'.dec');
        //   input.pipe(cipher).pipe(output);

        // });

        var key2 = crypto.randomBytes(32);
        var iv2 = crypto.randomBytes(16);
        var cipher2 = crypto.createCipheriv('aes-256-cbc', key2, iv2);
        var input2 = fs.createReadStream(names[1]);
        var output2 = fs.createWriteStream(names[1]+'.enc');
        input2.pipe(cipher2).pipe(output2);

        output2.on('finish', function() {
          console.log('Encrypted file written to disk!');
        });

      })
      .catch((err) => {
        console.log('Error: ', err);
      });

      const file = new File();
      file.originalname = file_data.path;
      file.name = file_data.filename;
      file.save(() => {
        res.status(200);
      });
      res.json({error_code:0,err_desc:null});
  });
};
