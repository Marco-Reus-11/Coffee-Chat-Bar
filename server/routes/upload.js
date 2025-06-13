const express = require('express');
const multer = require('multer');
const router = express.Router()
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 配置 Multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

    const upload = multer({ storage: storage });

    router.post('/file', upload.single('file'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: '未上传文件。' });
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ message: '文件上传成功', fileUrl: fileUrl });
    });

    module.exports = router