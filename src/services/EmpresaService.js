const connection = require('../connection');

module.exports = {
    buscarCategorias: (idEmpresa) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM categorias WHERE idEmpresa = ?', [idEmpresa], (err, result) => {
                
                if(err) {
                    reject(err);
                    return;
                }

                resolve(result);

            });
        });
    }
};