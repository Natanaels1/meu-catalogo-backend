const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require('fs');

module.exports = {
    buscarTodos: async (idEmpresa, produtosDestaque, pageTotal, page) => {
        try {
            console.log(produtosDestaque)
            const produtos = await prisma.produto.findMany({
                where: {
                    idEmpresa: {
                        equals: Number(idEmpresa)
                    },
                    AND: [
                        {
                            flProdutoDestaque: Boolean(produtosDestaque)
                        }
                    ]
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
                take: Number(pageTotal),
                skip: Number(page),
            });

            if(!produtos) {
                return "Nenhum produto encontrado.";
            };

            return produtos;

        } catch (erro) {
            console.log(erro);
        }
    },
    buscarProduto: async (idEmpresa, idProduto) => {
        try {

            const produto = await prisma.produto.findFirst({
                where: {
                    idEmpresa: {
                        equals: Number(idEmpresa)
                    },
                    id: Number(idProduto)
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
                return "Produto não encontrado.";
            };

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

                        await prisma.file.create({
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
    editaProduto: async (produto, files) => {
        try {

            const existsAlready = await prisma.produto.findFirst({
                where: { 
                    id: Number(produto.idProdutoEditado),
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
                }
            });

            if (!existsAlready) {
                return "Produto não encontrado";
            };

            const updateProduto = await prisma.produto.update({
                where: {
                    id: Number(produto.idProdutoEditado)
                },
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
            });

            const ids = produto.idsFilesDeleted;

            if(ids.length > 0) {

                const filesExist = existsAlready.Files;

                for (const id of ids) {

                    await prisma.file.delete({
                        where: {
                            id: Number(id),
                        }
                    });

                    filesExist.map( file => {
                        if(id === file.id) {
                            fs.unlinkSync(file.path);
                        }
                    });

                }

            }
        
            if (updateProduto) {

                for (const file of files) {
                    try {

                        const { originalname, path, mimetype } = file;

                        await prisma.file.create({
                            data: {
                                name: originalname,
                                path: path,
                                type: mimetype,
                                idProduto: produto.idProdutoEditado
                            }
                        });

                    } catch (error) {
                        console.error(`Erro ao inserir imagem no banco:`, error);
                    }
                }

            };

            return "Produto atualizado com sucesso.";

        } catch (erro) {
            console.log(erro);
        }
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