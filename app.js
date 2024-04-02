require('dotenv').config();
const Koa = require('koa');
// const socketIO = require('socket.io');
const compress = require('koa-compress');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();

// ------------ Configure Koajs ------------ //
app.use(cors());
app.use(logger());
app.use(koaBody({
    jsonLimit: '2000kb',
    extendTypes: {
        json: ['application/json'], // will parse application/x-javascript type body as a JSON string
    },
}));

app.use(compress());

// ------------ Error Handler ------------ //
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            ctx.status = err.statusCode || 500;

            if (ctx.status >= 200 && ctx.status <= 500) {
                ctx.body = { errors: err.errors.length ? err.errors : ['Server error'], message: err.message ? err. message : 'Something went wrong, please try again.' };
            } else {
                ctx.body = { errors: ['Server error'], message: 'Something went wrong, please try again.' };
            }

        } else {
            ctx.status = err.statusCode || 500;
            ctx.body = { errors: err.errors, message: err.message };
        }

    }
});



//--------------- Load routes ------------//
const routes = require('./api/routes');

app.use(routes.authRoutes.routes());


//--------------- Handle server error ------------//
app.on('error', (err, ctx) => {
    console.error('Server error', err);
});

//--------------- Up server ------------//
app.listen(process.env.PORT);
