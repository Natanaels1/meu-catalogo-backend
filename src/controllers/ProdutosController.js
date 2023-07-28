const ProdutosService = require('../services/ProdutosService');
const Joi = require('joi');

module.exports = {
    buscarTodos: async (req, res) => {

        const json = {error: '', result: []};
        const produtos = await ProdutosService.buscarTodos();

        for(let i in produtos) {
            json.result.push(produtos[i]);
        }

        res.send(json);

    },
    buscarProduto: async (req, res) => {

        const json = {error: '', result: {}};
        const { id } = req.params;

        const produto = await ProdutosService.buscarProduto(id);

        if(produto) {
            json.result = produto;
        }

        res.send(json);

    },
    cadastraProduto: async (req, res) => {

        const json = {error: '', result: {}};

        const produto = req.body;

        function validarFormulario(objeto) {
            
            const schema = Joi.object({
                nmProduto: Joi.string().required(),
                categoria: Joi.string().required(),
                vlProduto: Joi.number().positive().required(),
                descricao: Joi.string().required(),
                prontaEntrega: Joi.boolean().required(),
                produtosDisponiveis: Joi.number().integer().min(0).required(),
                produtoDestaque: Joi.boolean().required(),
                imgPrincipal: Joi.object().required(),
                imgsProduto: Joi.array().items(Joi.string()),
                idCategoria: Joi.number().required(),
            });

            const { error } = schema.validate(objeto);

            if (error) {
                res.status(400);
                res.send(error.details[0].message);
                return false;
            }

            return true;
        };

        if(validarFormulario(produto)) {

            const {
                nmProduto, 
                categoria, 
                vlProduto, 
                prontaEntrega, 
                descricao, 
                produtosDisponiveis, 
                produtoDestaque, 
                idCategoria
            } = produto;

            if(prontaEntrega === true) {
                produto.prontaEntrega = 0;
            } else {
                produto.prontaEntrega = 1;
            }

            if(produtoDestaque === true) {
                produto.produtoDestaque = 0;
            } else {
                produto.produtoDestaque = 1;
            }

            const idProduto = await ProdutosService.cadastraProduto(
                nmProduto, 
                categoria, 
                vlProduto, 
                prontaEntrega, 
                descricao, 
                produtosDisponiveis, 
                produtoDestaque, 
                idCategoria
            );

            json.result = idProduto;

        } else {
            json.error = 'Algum dado invalido';
        }

        res.send(json);

    },
    editaProduto: async (req, res) => {

        const json = {error: '', result: {}};

        const produto = req.body;

        function validarFormulario(objeto) {
            
            const schema = Joi.object({
                idProdutoEditado: Joi.number().required(),
                nmProduto: Joi.string().required(),
                categoria: Joi.string().required(),
                vlProduto: Joi.number().positive().required(),
                descricao: Joi.string().required(),
                prontaEntrega: Joi.boolean().required(),
                produtosDisponiveis: Joi.number().integer().min(0).required(),
                produtoDestaque: Joi.boolean().required(),
                imgPrincipal: Joi.string().required(),
                imgsProduto: Joi.array().items(Joi.string()),
                idCategoria: Joi.number().required(),
            });

            const { error } = schema.validate(objeto);

            if (error) {
                res.status(400);
                res.send(error.details[0].message);
                return false;
            }

            return true;
        };

        if(validarFormulario(produto)) {

            const {
                idProdutoEditado,
                nmProduto, 
                categoria, 
                vlProduto, 
                prontaEntrega, 
                descricao, 
                produtosDisponiveis, 
                produtoDestaque, 
                idCategoria
            } = produto;

            if(prontaEntrega === true) {
                produto.prontaEntrega = 0;
            } else {
                produto.prontaEntrega = 1;
            }

            if(produtoDestaque === true) {
                produto.produtoDestaque = 0;
            } else {
                produto.produtoDestaque = 1;
            }

            const response = await ProdutosService.editaProduto(
                idProdutoEditado,
                nmProduto, 
                categoria, 
                vlProduto, 
                prontaEntrega, 
                descricao, 
                produtosDisponiveis, 
                produtoDestaque, 
                idCategoria
            );

            json.result = response;

        } else {
            json.error = 'Algum dado invalido';
        }

        res.send(json);

    },
    deletaProduto: async (req, res) => {
        const json = {error: '', result: {}};
        const { id } = req.params;

        const produto = await ProdutosService.deletaProduto(id);

        if(produto) {
            json.result = produto;
        }

        res.send(json);
    }
}