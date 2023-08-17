const router = require("express").Router();
const upload = require("../config/multer");

//Services
const produtosController = require('../controllers/ProdutosController');
const AdminController = require('../controllers/AdminController');
const EmpresaController = require('../controllers/EmpresaController');

//Middlewares
const checkTokenAdmin = require('../middlewares/checkTokenAdmin');

//Rotas
router.route('/auth/loginAdmin').post(AdminController.login);
router.route('/auth/register').post(AdminController.register);
// router.route('/auth/dadosAdmin/:idAdmin').get(checkToken, AdminController.dadosAdmin);

router.route('/empresas/register').post(EmpresaController.register);
// router.route('/empresas/dadosEmpresa/:idEmpresa').get(checkToken, AdminController.dadosEmpresa);

router.route('/produtosCadastrados/:idEmpresa').get(checkTokenAdmin, produtosController.buscarTodos);
// router.route('/produto/:id').get(produtosController.buscarProduto);
// router.route('/categorias/:idEmpresa').get(checkToken, EmpresaController.buscarCategorias);

router.route('/produto').post(checkTokenAdmin, upload.array("files"), produtosController.cadastraProduto);
// router.route('/produto').put(checkToken , upload.array("files"), produtosController.editaProduto);
// router.route('/produto/:idProduto').delete(checkToken ,produtosController.deletaProduto);

module.exports = router;