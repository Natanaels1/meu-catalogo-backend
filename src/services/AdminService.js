const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    login: async (email, password) => {
        try {

            const emailHasCreated = await prisma.admin.findUnique({
                where: { email }
            });

            if(!emailHasCreated) {
                return null;
            }

            const empresa = await prisma.empresa.findUnique({
                where: { id: emailHasCreated.idEmpresa }
            });

            emailHasCreated.empresa = {
                name: empresa.name,
                cnpj_cpf: empresa.cnpj_cpf,
                email: empresa.email
            };
            
            return emailHasCreated;

        } catch (err) {
            console.log(err);
        }
    },
    register: async (name, email, password, emailEmpresa) => {
        try {

            const empresa = await prisma.empresa.findFirst({
                where: { email: emailEmpresa },
            });

            if(!empresa) {
                return {erro: "Empresa não encontrada, ou e-mail da empresa incorreto."};
            }

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
                    password,
                    idEmpresa: empresa.id
                },
            })

            return {
                mensagem: "Admin da empresa " + empresa.name + " cadastrado com sucesso."
            };

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