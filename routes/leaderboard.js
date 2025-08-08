import {
    getAllUsers,
    createUser,
    updateUserScore,
    getTopUsers,
    getUserWithContext,
} from '../controllers/users.js';
  
export default async function (fastify, opts) {
    fastify.get('/users', getAllUsers);
    fastify.post('/users', createUser);
    fastify.put('/users/:id/score', updateUserScore);
    fastify.get('/leaderboard/top/:n', getTopUsers);
    fastify.get('/leaderboard/user/:id', getUserWithContext);
}