const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const AdminService = require('../services/AdminService');

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
    
                if(result === null) {
                    res.status(403).json({ retorno: 'Usuário não encontrado.'});
                }
    
                const checkPassword = await bcrypt.compare(password, result.password);
    
                if(!checkPassword) {
                    res.status(401).json({ retorno: 'Senha inválida.'});
                };
    
                try {
    
                    const secret = process.env.SECRET;
    
                    const token = jwt.sign(
                        {
                            id: result.password,
                        },
                        secret
                    );

                    res.status(200).json({
                        mensagem: "Autenticado com sucesso.",
                        dadosAdmin: {
                            idAdmin: result.id,
                            name: result.name,
                            empresa: result['empresa']
                        },
                        token: token,
                    });
    
                } catch(erro) {
                    res.status(500).json({ erro: 'Ocorreu um erro no servidor, tente novamente mais tarde.'});
                }
    
            }

        } catch(erro) {
            console.log(erro);
        }
    },
    register: async (req, res) => {    
        try {

            const dadosUsuarioAdmin = req.body;
    
            function validarFormulario(objeto) {
    
                const schema = Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                    emailEmpresa: Joi.string().required(),
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
                    emailEmpresa
                } = dadosUsuarioAdmin;
    
                const salt = await bcrypt.genSalt(12);
                const passwordHash = await bcrypt.hash(password, salt);
        
                const response = await AdminService.register(
                    name, 
                    email, 
                    passwordHash, 
                    emailEmpresa
                );
    
                if(response.erro) {
                    res.status(404).send(response.erro);
                    return;
                }
    
                res.status(200).send(response.mensagem);
    
            }

        } catch(erro) {
            console.log(erro);
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
    editarDadosAdmin: async (req, res) => {

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
};