const router = require("express").Router();
const upload = require("../config/multer");

//Services
const produtosController = require('../controllers/ProdutosController');
const AdminController = require('../controllers/AdminController');
const EmpresaController = require('../controllers/EmpresaController');

//Middlewares
const checkTokenAdmin = require('../middlewares/checkTokenAdmin');

//Admin
router.route('/auth/register').post(AdminController.register);
router.route('/auth/loginAdmin').post(AdminController.login);

//Empresa
router.route('/empresas/register').post(EmpresaController.register);
router.route('/empresa/:nmEmpresa').get(EmpresaController.getDadosEmpresa);
router.route('/produto').post(checkTokenAdmin, upload.array("files"), produtosController.cadastraProduto);
router.route('/produto').put(checkTokenAdmin, upload.array("files"), produtosController.editaProduto);

//Get Produtos
router.route('/produtosCadastrados/:pageTotal/:page').get(produtosController.buscarTodos);
router.route('/Destaques/:idEmpresa').get(produtosController.getProdutosDestaque);
router.route('/produto/:nmEmpresa').get(produtosController.buscarProduto);

module.exports = router;