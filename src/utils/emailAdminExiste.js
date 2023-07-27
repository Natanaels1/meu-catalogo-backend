const connection = require("../connection");

module.exports = async function emailExiste(email) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM admins WHERE email = ?', [email], (err, res) => {

            if(err) {
                reject(err);
            }

            resolve(res);

        });
    });
};