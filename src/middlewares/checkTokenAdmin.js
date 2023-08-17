const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

module.exports = async function checkTokenAdmin(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split("Bearer ")[1];

    if(!token) {
        res.status(401).send("Acesso negado!");
    }

    try {

        const secret = process.env.SECRET;
        const result = jwt.verify(token, secret);

        if(result) {
            
            const decoded = jwt.decode(token, secret);

            const admin = await prisma.admin.findFirst({
                where: { password: decoded.id }
            })

            if(!admin) {
                res.status(401).send("Acesso negado, usuário não tem permissão de admin!");
                return;
            }

            next();
        };
        
    } catch(erro) {
        res.status(400).send("Token inválido!");
    }

};