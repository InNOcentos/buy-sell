const multer = require("multer");
const path = require('path');

const fileName = {};
const storage = multer.diskStorage({
    destination: function (req, file, next) {
      next(null, path.resolve(__dirname,`../public/img/`));
    },
    filename: function (req, file, next) {
        console.log(file);
        fileName.name = file;
        next(null,file.originalname);
    },
});
const uploadFile = multer({ storage: storage }).single(`avatar`);

module.exports = function(req,res,next) {
    uploadFile(req,res,function (err) {
        if (err) {
            console.log(err.message)
        }
        req.body.avatar = fileName.name.originalname;
        next();
        
    })
};