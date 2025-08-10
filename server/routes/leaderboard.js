import {
  getAllUsers,
  createUser,
  updateUserScore,
  getTopUsers,
  getUserWithContext,
} from "../controllers/users.js";

export default async function (fastify, opts) {
  fastify.get(
    "/users",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                image_url: { type: "string", nullable: true },
                score: { type: "integer" },
                created_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    getAllUsers,
  );

  fastify.post(
    "/users",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255 },
            image_url: { type: "string", format: "uri", nullable: true },
          },
        },
        response: {
          201: { type: "object" },
        },
      },
    },
    createUser,
  );

  fastify.put(
    "/users/:id/score",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "integer", minimum: 1 } },
        },
        body: {
          type: "object",
          required: ["score"],
          properties: { score: { type: "integer", minimum: 0 } },
        },
      },
    },
    updateUserScore,
  );

  fastify.get(
    "/leaderboard/top/:n",
    {
      schema: {
        params: {
          type: "object",
          required: ["n"],
          properties: { n: { type: "integer", minimum: 1, maximum: 100 } },
        },
      },
    },
    getTopUsers,
  );

  fastify.get(
    "/leaderboard/user/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "integer", minimum: 1 } },
        },
      },
    },
    getUserWithContext,
  );
}
