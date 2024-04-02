const jwt = require('../../libs/jwt');

const authMiddleware = async (ctx, next) => {

    const { authorization } = ctx.request.header;

    if (authorization) {
        const token = authorization.replace('Bearer ', '');

        try {
            const decoded = await jwt.decode(token);
            const { email } = decoded;

            const user = await User.getUserByEmail(email, ['trade_check', 'trade_expire_date'], { transaction: null });

            if (user) {
                ctx.user = user;

                return next();
            }

            ctx.status = 401;
            ctx.body = {
                message: 'Unauthorized.'
            };

        } catch (e) {
            ctx.status = 401;
            ctx.body = {
                message: 'Unauthorized.'
            };
        }

    }

    ctx.status = 401;
    ctx.body = {
        message: 'Unauthorized.'
    };
};

module.exports = {
    authMiddleware,
};