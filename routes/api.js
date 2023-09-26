const dotenv = require('dotenv');
const Route = require('express-route-group');
const authMiddleware = require('../auth/middlewares');

const tagController = require('../controller/tag.controller');
const userController = require('../controller/user.controller');
const noteController = require('../controller/note.controller');

const isAuth = authMiddleware.isAuth;

dotenv.config();

module.exports.registerRoutes = (app) => {
    /*
      * Register your routes here
      * app.use(prefix, routes_arr)
      * app.use(prefix, middlewares_arr, routes_arr)
      */
    app.use('/api/private', [isAuth],
        Route.routes([
            Route.post("/note/save/", noteController.saveNote),
            Route.get("/notes/:page", noteController.notePaginate),
            Route.delete("/note/delete/:id", noteController.deleteNote),
            
            Route.get("/tags", tagController.getAll),
        ])
    );
    app.use('/api',
        Route.routes([
            Route.post("/user/add", userController.createUser)
        ])
    );
}



