const jwt = require("jsonwebtoken");

module.exports = function checkToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split("Bearer ")[1];

    if(!token) {
        res.status(401).send("Acesso negado!");
    }

    try {

        const secret = process.env.SECRET;

        jwt.verify(token, secret);
        
        next();

    } catch(erro) {
        res.status(400).send("Token inválido!");
    }

};