const EmpresaService = require('../services/EmpresaService');
const Joi = require('joi');

module.exports = {
    register: async (req, res) => {    
        try {

            const dadosNovaEmpresa = req.body;
    
            function validarFormulario(objeto) {
    
                const schema = Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().required(),
                    cnpj_cpf: Joi.string().required(),
                });
        
                const { error } = schema.validate(objeto);
        
                if (error) {
                    res.status(401);
                    res.send(error.details[0].message);
                    return false;
                }
        
                return true;
    
            };
    
            if (validarFormulario(dadosNovaEmpresa)) {
                
                const {
                    name,
                    email,
                    cnpj_cpf,
                } = dadosNovaEmpresa;
    
                const response = await EmpresaService.register(
                    name,
                    email,
                    cnpj_cpf, 
                );
    
                if(response.erro) {
                    res.status(404).json(response.erro);
                    return;
                }
    
                res.status(200).json(response.result);
    
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
    getDadosEmpresa: async (req, res) => {

        const { nmEmpresa } = req.params;

        if(!nmEmpresa) {
            res.status(404).send("Informe o nome da empresa");
            return;
        };

        function formatarNomeEmpresa(s) {
            return s.replace(/([a-z])([A-Z])/g, '$1 $2');
        }

        const empresa = await EmpresaService.getDadosEmpresa(formatarNomeEmpresa(nmEmpresa));

        if(!empresa) {
            res.status(404).send(empresa);
            return;
        };

        res.json(empresa);
    }
};