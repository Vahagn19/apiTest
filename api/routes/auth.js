const Router = require('@koa/router');
const AuthController = require('../controllers/AuthController');

const router = new Router({ prefix: '/auth' });

router.post('/refresh', AuthController.refresh);
router.post('/login', AuthController.login);
router.post('/me', AuthController.me);

module.exports = router;