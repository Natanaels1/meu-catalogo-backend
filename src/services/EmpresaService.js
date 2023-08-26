const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    register: async (name, email, cnpj_cpf) => {
        try {

            const emailHasCreated = await prisma.empresa.findFirst({
                where: {
                    email: email
                }
            });

            if (emailHasCreated) {
                return {erro: "Empresa já possui cadastro."};
            }; 

            const newEmpresa = await prisma.empresa.create({ 
                data: {
                    name,
                    email,
                    cnpj_cpf
                }
            })

            return {
                mensagem: "Empresa cadastrada com sucesso",
            };

        } catch (err) {
            console.log(err);
        }
    },
    getDadosEmpresa: async (nmEmpresa) => {
        try {

            const empresa = await prisma.empresa.findFirst({
                where: {
                    name: {
                        equals: String(nmEmpresa)
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            });

            if(!empresa) {
                return "Empresa não encontrada.";
            };

            return empresa;

        } catch (erro) {
            return "Erro no banco:" + erro;
        }
    }
};