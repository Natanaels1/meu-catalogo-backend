const produtosController = require('../controllers/ProdutosController');
const AdminController = require('../controllers/AdminController');
const checkToken = require('../middlewares/checkToken');

function routes(app, options, done) {

    app.post('/auth/login', AdminController.login);
    app.post('/auth/register', AdminController.register);
    // app.put('/auth/admin', AdminController.editarDadosAdmin);
    // app.get('/auth/admin/:id', AdminController.dadosAdmin);

    app.get('/produtos', produtosController.buscarTodos);
    app.get('/produto/:id', produtosController.buscarProduto);
    
    app.post('/produto', {
        preHandler: checkToken,
    }, produtosController.cadastraProduto);

    app.put('/produto', {
        preHandler: checkToken
    }, produtosController.editaProduto);  

    app.delete('/produto/:id', {
        preHandler: checkToken, 
    }, produtosController.deletaProduto);

    done();

};

module.exports = routes;