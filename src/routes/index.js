const router = require("express").Router();

//Services
const produtosController = require('../controllers/ProdutosController');
const AdminController = require('../controllers/AdminController');

//Middlewares
const checkToken = require('../middlewares/checkToken');

//Rotas
router.route('/auth/login').post(AdminController.login);
router.route('/auth/register').post(AdminController.register);

router.route('/produtos').get(produtosController.buscarTodos);
router.route('/produto/:id').get(produtosController.buscarProduto);

router.route('/produto').post(checkToken ,produtosController.cadastraProduto);
router.route('/produto').put(checkToken ,produtosController.editaProduto);
router.route('/produto').delete(checkToken ,produtosController.deletaProduto);

module.exports = router;