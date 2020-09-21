'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const userValidator = require('../middlewares/user-validator');
const userSchema = require(`../schemas/new-user`);

const route = new Router();

module.exports = (app, userService,RefreshTokenService) => {
    app.use(`/user`, route);

    route.post('/', userValidator(userSchema), async (req,res,next)=> {
        try {
            const { firstName, lastName, email, password, avatar } = req.body;
            console.log(req.body);

            const newUser = await userService.add({firstName, lastName, email, password, avatar})
            res.status(HttpCode.CREATED).json(newUser);
        } catch(error) {
            console.log(error)
            next(error);
        }
    })
}