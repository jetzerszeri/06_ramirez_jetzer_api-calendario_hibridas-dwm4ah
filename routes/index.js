const usersRoutes = require('./usersRoutes');

function routerApi(app) {
    app.use('/users', usersRoutes);
}

module.exports = routerApi;