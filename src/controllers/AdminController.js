const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const AdminService = require('../services/AdminService');
const userAdminJaExiste = require('../hooks/useAdminJaExiste');

module.exports = {
    login: async (req, res) => {
        
        const {
            email,
            password
        } = req.body;

        console.log(userAdminJaExiste(email))

        // async function validar() {

        //     console.log(userAdminJaExiste(email))
        //     if(userAdminJaExiste(email)) {
        //         res.send('Possui conta');
        //         await verificaPassword(password);
        //     } else {
        //         res.send('E-mail não encontrado ou incorreto');
        //     }
           
        // };

        // async function verificaPassword(password) {
        //     console.log()
        // };

        // validar();

    },
    cadastro: async (req, res) => {

        const dadosUsuarioAdmin = req.body;

        function validarFormulario(objeto) {

            let validate = false;

            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                confirmPassword: Joi.string().required(),
                nameEmpresa: Joi.string().required(),
                CNPJ: Joi.number().required(),
            });
    
            const { error } = schema.validate(objeto);
    
            if (error) {
                res.status(401);
                res.send(error.details[0].message);
                validate = false;
            }
    
            if (userAdminJaExiste(objeto.email)) {
                res.status(401);
                res.send('E-mail já possui cadastro.');
                validate = false;
            }

            validate = true;
    
            return !!validate;

        };

        if (validarFormulario(dadosUsuarioAdmin)) {
            console.log('entrou')
        }
        // if (validarFormulario(dadosUsuarioAdmin)) {

        //     const {
        //         name,
        //         email,
        //         password,
        //         nameEmpresa,
        //         CNPJ
        //     } = dadosUsuarioAdmin;
    
        //     const salt = await bcrypt.genSalt(12);
        //     const passwordHash = await bcrypt.hash(password, salt);
    
        //     const admin = await AdminService.cadastro(
        //         name, 
        //         email, 
        //         passwordHash, 
        //         nameEmpresa, 
        //         CNPJ
        //     );
    
        //     if (admin) {
        //         res.send(admin);
        //     }
        // };

    },
    dadosAdmin: async (req, res) => {

    },
    editarDadosAdmin: async (req, res) => {

    },
};