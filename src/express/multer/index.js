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
const upload = multer({ storage: storage }).single(`avatar`);

exports.uploadFile = async (req,res,next) => {
    
    upload(req,res,function (err) {
        if (err) {
            console.log(err.message)
        }
        if (!fileName.name) {
            next();
            return;
        }
        req.body.avatar = fileName.name.originalname;
        next();
        
    })
};
exports.deleteFile = async (req,res,next) => {
    if (fileName.name) {
        delete fileName.name;
    }
    next();
}