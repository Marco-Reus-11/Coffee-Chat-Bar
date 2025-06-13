// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL; 
        if (!mongoUrl) {
            console.error('错误: MONGO_URL 环境变量未设置!');
            process.exit(1); 
        }

        await mongoose.connect(mongoUrl);
        console.log('MongoDB 连接成功!');
    } catch (err) {
        console.error('MongoDB 连接失败:', err);
        process.exit(1); // 连接失败时退出应用
    }
};

module.exports = connectDB; // 导出连接函数