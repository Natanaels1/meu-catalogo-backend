const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const AdminService = require('../services/AdminService');
const emailAdminExiste = require('../utils/emailAdminExiste');

module.exports = {
    login: async (req, res) => {
        
        const dadosLogin = req.body;
        
        function validarFormulario(objeto) {

            const schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            });

            const { error } = schema.validate(objeto);
    
            if (error) {
                res.status(401);
                res.send(error.details[0].message);
                return false;
            }

            return true;
        };

        if(validarFormulario(dadosLogin)) {

            const {
                email,
                password
            } = dadosLogin;

            const result = await AdminService.login(email, password);

            if(result.length === 0) {
                res.status(403);
                res.send('Usuário não encontrado.');
            }

            const checkPassword = await bcrypt.compare(password, result[0].password);

            if(!checkPassword) {
                res.status(401).send('Senha inválida.');
            };

            try {

                const secret = process.env.SECRET;

                const token = jwt.sign(
                    {
                        id: result[0].id,
                    },
                    secret
                )

                res.send({
                    message: 'Autenticado com sucesso.',
                    nameAdmin: result[0].name,
                    nameEmpresa: result[0].nameEmpresa,
                    token: token
                });

            } catch(erro) {
                res.send('Ocorreu um erro no servidor, tente novamente mais tarde.');
            }

        }

    },
    register: async (req, res) => {

        const dadosUsuarioAdmin = req.body;

        function validarFormulario(objeto) {

            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                confirmPassword: Joi.string().required(),
                nameEmpresa: Joi.string().required(),
                CNPJ: Joi.string().required(),
            });
    
            const { error } = schema.validate(objeto);
    
            if (error) {
                res.status(401);
                res.send(error.details[0].message);
                return false;
            }
    
            return true;

        };

        if (validarFormulario(dadosUsuarioAdmin)) {
            
            const {
                name,
                email,
                password,
                nameEmpresa,
                CNPJ
            } = dadosUsuarioAdmin;

            const emailCadastrado = await emailAdminExiste(email);

            if(emailCadastrado.length > 0) {
                res.status(401).send('E-mail já cadastrado');
                return;
            };

            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
    
            const admin = await AdminService.register(
                name, 
                email, 
                passwordHash, 
                nameEmpresa, 
                CNPJ
            );
    
            if(admin){
                res.send(admin);
            }

        }

    },
    dadosAdmin: async (req, res) => {

    },
    editarDadosAdmin: async (req, res) => {

    },
};