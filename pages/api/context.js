import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const context = () => ({ db });

export default context;
