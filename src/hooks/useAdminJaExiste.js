const connection = require('../connection');

module.exports = function userAdminJaExiste(email) {

    connection.query('SELECT * FROM admins WHERE email = ?', [email], (err, result) => {

        if(result.length > 0) {
            return true;
        }

        return false;
    });

};