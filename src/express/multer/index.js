const multer = require("multer");

const fileName = {};
const storage = multer.diskStorage({
    destination: function (req, file, next) {
      next(null, `src/express/uploads/`);
    },
    filename: function (req, file, next) {
        fileName.name = file;
        next(null,file.fieldname + '.jpg');
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