const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    register: async (name, email, cnpj_cpf) => {
        try {

            const emailHasCreated = await prisma.empresas.findUnique({
                where: { email }
            })
            console.log('console:', emailHasCreated)

            if (emailHasCreated) {
                return {erro: "Empresa já possui cadastro."};
            };


            // const newEmpresa = await prisma.empresa.create({
            //     data: {
            //         name,
            //         email,
            //         cnpj_cpf
            //     },
            // })

            // return newEmpresa;

        } catch (err) {
            console.log(err);
        }
    }
};