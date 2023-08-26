const ProdutosService = require('../services/ProdutosService');
const Joi = require('joi');

module.exports = {
    buscarTodos: async (req, res) => {

        const {
            pageTotal,
            page
        } = req.params;

        const querys = req.query;

        const idEmpresa = querys['100'];
        const produtosDestaque = querys['102'];

        if (!idEmpresa) {
            res.status(401).json({ erro: 'Informe o id da empresa' });
            return;
        }

        const produtos = await ProdutosService.buscarTodos(idEmpresa, produtosDestaque, pageTotal, page);

        if(!produtos) {
            res.status(404).send("Nenhum produto encontrado");
        }

        res.json(produtos);

    },
    buscarProduto: async (req, res) => {

        const querys = req.query;

        const idEmpresa = querys['100'];
        const idProduto = querys['101'];

        if(!idEmpresa) {
            res.status(404).send("Informe o id da Empresa.");
            return;
        }

        if(!idProduto) {
            res.status(404).send("Informe o id do produto.");
            return;
        }

        const produto = await ProdutosService.buscarProduto(idEmpresa, idProduto);

        res.json(produto);

    },
    cadastraProduto: async (req, res) => {
        try {

            const produto = JSON.parse(req.body.body);
            const files = req.files;

            function validarFormulario(objeto) {

                const schema = Joi.object({
                    idEmpresa: Joi.number().required(),
                    nmProduto: Joi.string().required(),
                    vlProduto: Joi.number().positive().required(),
                    descricao: Joi.string().required(),
                    flProntaEntrega: Joi.boolean().required(),
                    qntdProdutosDisponiveis: Joi.number().integer().min(0).required(),
                    flProdutoDestaque: Joi.boolean().required(),
                    idCategoria: Joi.number().required(),
                });

                const { error } = schema.validate(objeto);

                if (error) {
                    res.status(404);
                    res.send(error.details[0].message);
                    return false;
                }

                return true;
            };

            if (validarFormulario(produto)) {

                const newProduto = await ProdutosService.cadastraProduto(produto, files);

                res.json(newProduto);

            } else {
                res.status(404).send('Algum dado invalido');
            }

        } catch (erro) {
            console.log(erro);
        }
    },
    editaProduto: async (req, res) => {
        try {

            const produto = JSON.parse(req.body.body);
            const files = req.files;

            function validarFormulario(objeto) {

                const schema = Joi.object({
                    idProdutoEditado: Joi.number().required(),
                    nmProduto: Joi.string().required(),
                    vlProduto: Joi.number().positive().required(),
                    descricao: Joi.string().required(),
                    flProntaEntrega: Joi.boolean().required(),
                    qntdProdutosDisponiveis: Joi.number().integer().min(0).required(),
                    flProdutoDestaque: Joi.boolean().required(),
                    idCategoria: Joi.number().required(),
                    idsFilesDeleted: Joi.array()
                });

                const { error } = schema.validate(objeto);

                if (error) {
                    res.status(400);
                    res.send(error.details[0].message);
                    return false;
                }

                return true;
            };

            if (validarFormulario(produto)) {

                const produtoEditado = await ProdutosService.editaProduto(produto, files);

                res.json(produtoEditado);

            } else {
                res.status(404).send('Algum dado invalido');
            }

        } catch (erro) {
            console.log(erro);
        }
    },
    deletaProduto: async (req, res) => {
        const json = { error: '', result: {} };
        const { idProduto } = req.params;

        const produto = await ProdutosService.deletaProduto(idProduto);

        if (produto) {
            json.result = produto;
        }

        res.send(json);
    },
    getProdutosDestaque:  async (req, res) => {

        const {idEmpresa} = req.params;

        if(!idEmpresa) {
            res.status(404).send("Id empresa não informado.");
            return;
        }

        res.send("Funciona");

    }
}