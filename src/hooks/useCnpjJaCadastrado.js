const connection = require('../connection');

module.exports = function useCnpjJaCadastrado(cnpj) {
    connection.query('SELECT * FROM admins WHERE CNPJ = ?', [cnpj], (err, result) => {
        const cnpjExists = result.length > 0;
        return cnpjExists;
    });
};