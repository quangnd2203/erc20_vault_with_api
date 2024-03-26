import * as express from 'express';
import smartContractRouter from './smart_contracts';
const router = express.Router();

const routes = [
    {
        path: '/smart_contracts',
        route: smartContractRouter,
    }
];

routes.forEach(
    (route) => {
        router.use(route.path, route.route);
    }
);

export default router;