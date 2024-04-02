const jwt = require('../../libs/jwt');
class AuthController {

    static async login(ctx) {
        const { email, password, ...payload } = ctx.request.body;

        if (email !== process.env.TEST_EMAIL || password !== process.env.TEST_PASSWORD) {
            ctx.body = {
                message: 'Invalid credentials!'
            };
            ctx.status = 401;

            return;
        }

        try {
            const token = await jwt.generate({
                email,
                ...payload,
            }, 2);
            const refreshToken = await jwt.generate({
                email,
                ...payload,
            }, 10);

            ctx.body = {
                token,
                refreshToken
            };
            ctx.status = 200;
        } catch (e) {
            console.log(e);

            ctx.body = {
                message: 'Something went wrong!'
            };
            ctx.status = 500;

            return;
        }


    }

    static async refresh(ctx) {
        const Token = ctx?.request?.body?.refreshToken ? ctx.request.body.refreshToken.replace('Bearer ','') : '';

        if (!refreshToken) {
            ctx.body = {
                message: 'Refresh token required!'
            };
            ctx.status = 400;

            return;
        }

        if (ctx?.app?.refreshTokens && Array.isArray(ctx.app.refreshTokens) && ctx.app.refreshTokens.includes(refreshToken)) {
            ctx.body = {
                message: 'Invalid token!'
            };
            ctx.status = 400;

            return;
        }

        try {

            const { exp, iat, ...payload } = await jwt.decode(refreshToken);

            const newToken = await jwt.generate(payload, 2);
            const newRefreshToken = await jwt.generate(payload, 10);


            if (ctx?.app?.refreshTokens && Array.isArray(ctx.app.refreshTokens)) {
                ctx.app.refreshTokens.push(refreshToken);
            } else {
                ctx.app.refreshTokens = [refreshToken];
            }

            ctx.body = {
                token: newToken,
                refreshToken: newRefreshToken,
            }

            ctx.status = 200;

            return;
        } catch (e) {
            console.log(e);

            ctx.body = {
                message: 'Token expired!'
            };
            ctx.status = 400;

            return;
        }
    }

    static async me(ctx) {
        const token = ctx?.request?.headers?.authorization ? ctx.request.headers.authorization.replace('Bearer ','') : '';

        if (!token) {
            ctx.body = {
                message: 'Unauthorized!'
            };
            ctx.status = 401;

            return;
        }

        try {
            const { iat, exp, ...payload} = await jwt.decode(token);

            ctx.body = payload;
            ctx.status = 200;

        } catch (e) {
            console.log(e);

            ctx.body = {
                message: 'Unauthorized!'
            };
            ctx.status = 401;

            return;
        }
    }
}

module.exports = AuthController;