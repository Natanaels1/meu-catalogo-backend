const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require('fs');

module.exports = {
    buscarTodos: async (idEmpresa) => {
        try {

            const produtos = await prisma.produto.findMany({
                where: {
                    idEmpresa: idEmpresa,
                },
                include: {
                    Files: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            type: true
                        }
                    },
                },
            })

            return produtos;

        } catch (erro) {

        }
    },
    buscarProduto: async (idEmpresa, id) => {
        try {

            const produto = await prisma.produto.findFirst({
                where: {
                    idEmpresa: idEmpresa,
                    id: id
                },
                include: {
                    Files: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            type: true
                        }
                    },
                },
            });

            if (!produto) {
                return "Produto não encontrado."
            }

            return produto;

        } catch (erro) {
            console.log(erro);
        }
    },
    cadastraProduto: async (produto, files) => {
        try {

            const existsAlready = await prisma.produto.findFirst({
                where: { name: produto.nmProduto }
            });

            if (existsAlready) {
                return "Já existe um produto com esse nome cadastrado, tente outro."
            };

            const newProduto = await prisma.produto.create({
                data: {
                    name: produto.nmProduto,
                    vlProduto: produto.vlProduto,
                    description: produto.descricao,
                    qntdProdutosDisponiveis: produto.qntdProdutosDisponiveis,
                    flProntaEntrega: produto.flProntaEntrega,
                    flProdutoDestaque: produto.flProdutoDestaque,
                    idEmpresa: produto.idEmpresa,
                    idCategoria: produto.idCategoria
                }
            })

            if (newProduto) {

                for (const file of files) {
                    try {

                        const { originalname, path, mimetype } = file;

                        const fileUp = await prisma.file.create({
                            data: {
                                name: originalname,
                                path: path,
                                type: mimetype,
                                idProduto: newProduto.id
                            }
                        });

                    } catch (error) {
                        console.error(`Erro ao inserir imagem no banco:`, error);
                    }
                }

            }

            return {
                mensagem: "Produto cadastrado com sucesso.",
                id: newProduto.id
            };

        } catch (erro) {
            console.log(erro);
        }
    },
    editaProduto: (
        idProdutoEditado,
        nmProduto,
        vlProduto,
        prontaEntrega,
        descricao,
        produtosDisponiveis,
        produtoDestaque,
        idCategoria,
        imgsProduto
    ) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM produtos WHERE idProduto = ?', [Number(idProdutoEditado)], (err, result) => {

                if (!result) {
                    reject(err);
                    return;
                }

                const imgs = JSON.parse(result[0].imgsProduto);

                if (imgsProduto) {
                    imgs.map(img => {
                        fs.unlinkSync(img.src);
                    });
                }

                connection.query(`UPDATE produtos SET   
                    nmProduto = '${nmProduto}',  
                    vlProduto = ${vlProduto}, 
                    prontaEntrega = ${prontaEntrega}, 
                    descricao = '${descricao}', 
                    produtosDisponiveis = ${produtosDisponiveis}, 
                    produtoDestaque = ${produtoDestaque}, 
                    idCategoria = ${idCategoria},
                    imgsProduto = '${imgsProduto ? imgsProduto : JSON.stringify(imgs)}'
                    WHERE idProduto = ?
                `,
                    [idProdutoEditado]
                    , (err, result) => {

                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve({
                            message: 'Edição realizada com sucesso.'
                        });

                    }
                );
            })
        })
    },
    deletaProduto: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM produtos WHERE idProduto = ?', [Number(id)], (err, result) => {

                if (!result) {
                    reject(err);
                    return;
                }

                const imgs = JSON.parse(result[0].imgsProduto);

                imgs.map(img => {
                    fs.unlinkSync(img.src);
                })

                connection.query('DELETE FROM produtos WHERE idProduto = ?', [Number(id)], (err, res) => {

                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve('Produto excluido.');
                });

            });
        });
    }
};