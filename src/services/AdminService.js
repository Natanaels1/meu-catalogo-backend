const connection = require('../connection');

module.exports = {
    login: (email, password) => {

    },
    cadastro: (name, email, password, nameEmpresa, CNPJ) => {
        return new Promise((resolve, reject) => {

            connection.query('INSERT INTO admins (name, email, password, nameEmpresa, CNPJ) VALUES (?, ?, ?, ?, ?)', 
                [name, email, password, nameEmpresa, CNPJ], (err, result) => {
                
                if(err) {
                    reject(err);
                    return;
                }
                
                resolve({
                    message: 'Admin cadastrado com sucesso.'
                });

            });

        });
    },
    dadosAdmin: () => {

    },
    editarDadosAdmin: () => {

    },
};