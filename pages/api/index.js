import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import schema from "./schema";
// import context from "./context";

const db = new PrismaClient();
const context = () => ({ db });

const server = new ApolloServer({ schema, context });
const handler = server.createHandler({ path: "/api" });

export const config = { api: { bodyParser: false } };

export default handler;
