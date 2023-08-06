const router = require("express").Router();
const upload = require("../config/multer");

//Services
const produtosController = require('../controllers/ProdutosController');
const AdminController = require('../controllers/AdminController');
const EmpresaController = require('../controllers/EmpresaController');

//Middlewares
const checkToken = require('../middlewares/checkToken');

//Rotas
router.route('/auth/login').post(AdminController.login);
router.route('/auth/register').post(AdminController.register);
router.route('/auth/dadosAdmin/:idAdmin').get(checkToken, AdminController.dadosAdmin);

router.route('/empresas/dadosEmpresa/:idEmpresa').get(checkToken, AdminController.dadosEmpresa);

router.route('/produtos/:idEmpresa').get(checkToken, produtosController.buscarTodos);
router.route('/produto/:id').get(produtosController.buscarProduto);
router.route('/categorias/:idEmpresa').get(checkToken, EmpresaController.buscarCategorias);

router.route('/produto').post(checkToken, upload.array("files"),produtosController.cadastraProduto);
router.route('/produto').put(checkToken ,produtosController.editaProduto);
router.route('/produto').delete(checkToken ,produtosController.deletaProduto);

module.exports = router;