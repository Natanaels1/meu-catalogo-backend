const EmpresaService = require('../services/EmpresaService');
const Joi = require('joi');

module.exports = {
    buscarCategorias: async (req, res) => {

        const json = {error: '', result: []};
        const { idEmpresa } = req.params;
  
        if(!idEmpresa) {
            res.status(401).json({ erro: 'Informe o id da empresa' });
            return;
        }

        const categorias = await EmpresaService.buscarCategorias(idEmpresa);

        for(let i in categorias) {

            // produtos[i].prontaEntrega = produtos[i].prontaEntrega === 0 ? true : false;
            // produtos[i].produtoDestaque = produtos[i].produtoDestaque === 0 ? true : false;
            // produtos[i].produtoAtivo = produtos[i].produtoAtivo === 0 ? true : false;

            json.result.push(categorias[i]);
        }

        res.send(json);
    }
};