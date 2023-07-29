const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const AdminService = require('../services/AdminService');
const emailAdminExiste = require('../utils/emailAdminExiste');
const { json } = require('express');

module.exports = {
    login: async (req, res) => {
        try {

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
                    res.status(403).json({ retorno: 'Usuário não encontrado.'});
                }
    
                const checkPassword = await bcrypt.compare(password, result[0].password);
    
                if(!checkPassword) {
                    res.status(401).json({ retorno: 'Senha inválida.'});
                };
    
                try {
    
                    const secret = process.env.SECRET;
    
                    const token = jwt.sign(
                        {
                            id: result[0].id,
                        },
                        secret
                    )
    
                    res.status(200).json([
                        {
                            message: 'Autenticado com sucesso.',
                            idAdmin: result[0].idAdmin,
                            nmAdmin: result[0].nmAdmin,
                            idEmpresa: result[0].idEmpresa,
                            token: token
                        }                            
                    ]);
    
                } catch(erro) {
                    res.status(500).json({ retorno: 'Ocorreu um erro no servidor, tente novamente mais tarde.'});
                }
    
            }

        } catch(erro) {
            console.log(erro);
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

        /* 
            Adicionar

            function isValidEmail(email) {
                // Regular expression to validate email format
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                // Test the email against the regular expression
                return emailPattern.test(email);
            }

        */

    },
    dadosAdmin: async (req, res) => {
        try {

            const json = {error: '', result: {}};
            const { idAdmin } = req.params;

            if(!idAdmin) {
                res.status(401).json({ erro: 'Informe o id do admin' });
                return;
            }

            const admin = await AdminService.dadosAdmin(idAdmin);
            
            if(admin) {
                json.result = admin;
            }

            res.json(json);

        } catch(erro) {

        }
    },
    editarDadosAdmin: async (req, res) => {

    },
    dadosEmpresa: async (req, res) => {
        try {

            const json = {error: '', result: {}};
            const { idEmpresa } = req.params;

            if(!idEmpresa) {
                res.status(401).json({ erro: 'Informe o id da empresa' });
                return;
            }

            const empresa = await AdminService.dadosEmpresa(idEmpresa);
            
            if(empresa) {
                json.result = empresa;
            }

            res.json(json);

        } catch(erro) {

        }
    },
};