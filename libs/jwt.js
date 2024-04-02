const jwt = require('jsonwebtoken');

class Jwt {
    async generate(payload, expiresIn) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: `${expiresIn}m`,
        });
    }

    async decode(token) {
        return jwt.verify(token, process.env.JWT_SECRET, {
            alg: 'HS512',
        });
    }
}

module.exports = new Jwt();

