const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    login: async (email, password) => {
        try {

            const emailHasCreated = await prisma.admin.findUnique({
                where: { email }
            })

            return emailHasCreated;

        } catch (err) {
            console.log(err);
        }
    },
    register: async (name, email, password) => {
        try {

            const emailHasCreated = await prisma.admin.findUnique({
                where: { email }
            });

            if (emailHasCreated) {
                return {erro: "E-mail já cadastrado, tente outro."};
            };

            const newAdmin = await prisma.admin.create({
                data: {
                    name,
                    email,
                    password
                },
            })

            return {result: [newAdmin]};

        } catch (err) {
            return String(err);
        }
    },
    dadosAdmin: (idAdmin) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM admins WHERE admins.idAdmin = ?', [idAdmin], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    },
    editarDadosAdmin: () => {

    },
    dadosEmpresa: (idEmpresa) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM empresas WHERE idEmpresa = ?', [idEmpresa], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    },
};