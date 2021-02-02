import {
  extendType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "@nexus/schema";
import { join } from "path";
import { makeSchema } from "@nexus/schema";

// Here we create our user object type.
const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("firstName");
    t.string("lastName");
    t.int("age");
    t.string("img");
  },
});

// We extend our query to have user.
const UserQuery = extendType({
  type: "Query",
  definition(t) {
    // This definition queries for invidivual user by ID or Username
    t.field("user", {
      type: "User",
      args: { id: intArg(), firstName: stringArg() },
      resolve(_root, args, ctx) {
        return ctx.db.user.findFirst({
          where: { OR: { id: args.id, firstName: args.firstName } },
        });
      },
    });

    // This definition will query all users in our DB.
    t.nonNull.list.field("users", {
      type: "User",
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
  },
});

const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: "User",
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        age: nonNull(intArg()),
        img: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        const isUserExist = await ctx.db.user.findFirst({
          where: { firstName: args.firstName, lastName: args.lastName },
        });

        if (isUserExist) {
          throw new Error("This user already exists.");
        }

        const user = {
          firstName: args.firstName,
          lastName: args.lastName,
          age: args.age,
          img: args.img,
        };

        return ctx.db.user.create({ data: user });
      },
    });
  },
});

const schema = makeSchema({
  types: [User, UserQuery, UserMutation],
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: require.resolve("./context"),
        alias: "ContextModule",
      },
    ],
    contextType: "ContextModule.Context",
  },
});

export default schema;
