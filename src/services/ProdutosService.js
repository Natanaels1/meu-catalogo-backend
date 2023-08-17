const prisma = require('@prisma/client');
const fs = require('fs');

module.exports = {
    buscarTodos: (idEmpresa) => {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM produtos WHERE produtos.idEmpresa = ?', [idEmpresa], (err, result) => {
                
                if(err) {
                    reject(err);
                    return;
                }

                resolve(result);

            });
        });

    },
    buscarProduto: (id) => {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM produtos WHERE produtos.id = ?', [id] , (err, result) => {

                if(err) {
                    reject(err);
                    return;
                }

                if(result.length > 0) {
                    resolve(result[0]);
                }

            })
        });

    },
    cadastraProduto: (
        idEmpresa,
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
            connection.query(
                'INSERT INTO produtos (nmProduto, vlProduto, prontaEntrega, descricao, produtosDisponiveis, produtoDestaque, idCategoria, idEmpresa, imgsProduto) VALUES (?,?,?,?,?,?,?,?,?)', 
                [
                    nmProduto,
                    vlProduto, 
                    prontaEntrega, 
                    descricao, 
                    produtosDisponiveis, 
                    produtoDestaque, 
                    idCategoria,
                    idEmpresa,
                    imgsProduto
                ]
                , (err, result) => {
                    
                    if(err) {
                        reject(err);
                        return;
                    }

                    resolve({
                        message: 'Cadastro realizado com sucesso.',
                        idProdutoCadastrado: result.insertId
                    });
                
                }
            )
        })
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

                if(!result) { 
                    reject(err);
                    return;
                }     

                const imgs = JSON.parse(result[0].imgsProduto);

                if(imgsProduto) {
                    imgs.map( img => {
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
                    
                    if(err) {
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

                if(!result) { 
                    reject(err);
                    return;
                }     

                const imgs = JSON.parse(result[0].imgsProduto);

                imgs.map( img => {
                    fs.unlinkSync(img.src);
                })

                connection.query('DELETE FROM produtos WHERE idProduto = ?', [Number(id)], (err, res) => {

                    if(err) { 
                        reject(err);
                        return;
                    }
    
                    resolve('Produto excluido.');
                });

            });
        });
    }
};