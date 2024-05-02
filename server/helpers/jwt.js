const jwt = require('jsonwebtoken')
const secretkey = 'secretkeykevin'

const generateToken = (payload) =>{
    return jwt.sign(payload, secretkey)
}

const verifyToken = (token) =>{
    return jwt.verify(token, secretkey)
}

module.exports = {generateToken,verifyToken}