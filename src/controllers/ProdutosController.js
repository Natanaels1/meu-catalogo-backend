const ProdutosService = require('../services/ProdutosService');
const Joi = require('joi');

module.exports = {
    buscarTodos: async (req, res) => {

        const json = { error: '', result: [] };
        const { idEmpresa } = req.params;

        if (!idEmpresa) {
            res.status(401).json({ erro: 'Informe o id da empresa' });
            return;
        }

        const produtos = await ProdutosService.buscarTodos(idEmpresa);

        for (let i in produtos) {

            produtos[i].prontaEntrega = produtos[i].prontaEntrega === 0 ? true : false;
            produtos[i].produtoDestaque = produtos[i].produtoDestaque === 0 ? true : false;
            produtos[i].produtoAtivo = produtos[i].produtoAtivo === 0 ? true : false;
            produtos[i].imgsProduto = JSON.parse(produtos[i].imgsProduto);

            json.result.push(produtos[i]);
        }

        res.send(json);

    },
    buscarProduto: async (req, res) => {

        const json = { error: '', result: {} };
        const { id } = req.params;

        const produto = await ProdutosService.buscarProduto(id);

        if (produto) {
            json.result = produto;
        }

        res.send(json);

    },
    cadastraProduto: async (req, res) => {
        try {

            const json = { error: '', result: {} };

            const produto = JSON.parse(req.body.body);
            const files = req.files;

            function validarFormulario(objeto) {

                const schema = Joi.object({
                    idEmpresa: Joi.number().required(),
                    nmProduto: Joi.string().required(),
                    vlProduto: Joi.number().positive().required(),
                    descricao: Joi.string().required(),
                    prontaEntrega: Joi.boolean().required(),
                    produtosDisponiveis: Joi.number().integer().min(0).required(),
                    produtoDestaque: Joi.boolean().required(),
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

            if (validarFormulario(produto)) {

                const {
                    idEmpresa,
                    nmProduto,
                    vlProduto,
                    prontaEntrega,
                    descricao,
                    produtosDisponiveis,
                    produtoDestaque,
                    idCategoria
                } = produto;

                if(produto.prontaEntrega) {
                    produto.prontaEntrega = 0
                } else {
                    produto.prontaEntrega = 1
                }

                if(produto.produtoDestaque) {
                    produto.produtoDestaque = 0
                } else {
                    produto.produtoDestaque = 1
                }
                
                const imgsProduto = [];

                files.map( (img, index) => {
                    imgsProduto.push({
                        id: index,
                        name: img.originalname,
                        src: img.path, 
                    });
                });

                const idProduto = await ProdutosService.cadastraProduto(
                    produto.idEmpresa,
                    produto.nmProduto,
                    produto.vlProduto,
                    produto.prontaEntrega,
                    produto.descricao,
                    produto.produtosDisponiveis,
                    produto.produtoDestaque,
                    produto.idCategoria,
                    JSON.stringify(imgsProduto)
                );
                    
                json.result = idProduto;

            } else {
                json.error = 'Algum dado invalido';
            }

            res.send(json);

        } catch (erro) {
            console.log(erro);
        }

    },
    editaProduto: async (req, res) => {

        const json = { error: '', result: {} };

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

        if (validarFormulario(produto)) {

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

            if (prontaEntrega === true) {
                produto.prontaEntrega = 0;
            } else {
                produto.prontaEntrega = 1;
            }

            if (produtoDestaque === true) {
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
        const json = { error: '', result: {} };
        const { idProduto } = req.params;

        const produto = await ProdutosService.deletaProduto(idProduto);

        if (produto) {
            json.result = produto;
        }

        res.send(json);
    },
}