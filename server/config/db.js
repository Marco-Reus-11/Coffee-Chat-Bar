const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/')
    console.log('数据库连接成功')
  } catch (err) {
    console.error('数据库连接失败', err)
    process.exit(1)
  }
}

module.exports = connectDB
