const connection = require('../connection');

module.exports = {
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM admins WHERE email = ?', [email], (err, result) => {
                
                if(err) {
                    reject(err);
                    return;
                }

                resolve(result);

            });
        });
    },
    register: (name, email, password, nameEmpresa, CNPJ) => {
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
    dadosAdmin: (idAdmin) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM admins WHERE admins.idAdmin = ?', [idAdmin], (err, result) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    },
    editarDadosAdmin: () => {

    },
    dadosEmpresa: (idEmpresa) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM empresas WHERE idEmpresa = ?', [idEmpresa], (err, result) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    },
};