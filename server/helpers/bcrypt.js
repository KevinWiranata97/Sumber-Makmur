const bcrypt = require('bcryptjs')

const hashpassword = (password) =>{
    return bcrypt.hashSync(password,10)
}

const comparePassword = (password, hashpassword) =>{
    return bcrypt.compareSync(password, hashpassword)
}

module.exports = {hashpassword, comparePassword}