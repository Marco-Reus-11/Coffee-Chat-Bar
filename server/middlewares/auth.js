const jwt = require("jsonwebtoken")

function authMiddlewares(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "未提供 Token" })
    }
    try {
        const decoded = jwt.verify(token, "MORTALKOMBAT")
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token 无效或已过期" })
    }
}

module.exports = authMiddlewares