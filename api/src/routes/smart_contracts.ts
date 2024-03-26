import * as express from 'express';
import * as controller from '../controllers/nitro_token_controller';

const vaultRouter = express.Router();

vaultRouter.post('/transfer', async (req, res) => {
    controller.transfer(req).then((value) => res.status(value.code).send(value));
});

vaultRouter.get('/balance_of', async (req, res) => {
    controller.balanceOf(req).then((value) => res.status(value.code).send(value));
});

vaultRouter.get('/total_supply', async (req, res) => {
    controller.totalSupply().then((value) => res.status(value.code).send(value));
});

export default vaultRouter;