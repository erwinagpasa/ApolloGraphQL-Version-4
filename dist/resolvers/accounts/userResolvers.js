import { Users } from "../../models/accounts/User.js";
const userResolvers = {
    Query: {
        hello: () => 'Hello, erwin agpasa!',
        user: async () => {
            try {
                const results = await Users.find(); // Use await to make sure the query is executed
                return results;
            }
            catch (error) {
                console.error("An error occurred while fetching data:", error);
                throw new Error("Failed to fetch data");
            }
        },
        userByUsername: async (_, args) => {
            try {
                const user = await Users.findOneBy({ username: args.username }); // Use findOne to get a single user
                return user;
            }
            catch (error) {
                console.error("An error occurred while fetching data:", error);
                throw new Error("Failed to fetch data");
            }
        },
    },
    Mutation: {
        createUser: async (_, args) => {
            try {
                const newUser = await Users.save({
                    name: args.input.name,
                    username: args.input.username,
                    password: args.input.password,
                    email: args.input.email
                });
                return newUser;
            }
            catch (error) {
                console.error("An error occurred while creating a new user:", error);
                throw new Error("Failed to create a new user");
            }
        },
        updateUser: async (_, args) => {
            const { id, name, username, password, email } = args.input;
            try {
                const existingUser = await Users.findOneBy(id);
                if (!existingUser) {
                    throw new Error("User not found");
                }
                // Update the user properties
                existingUser.name = name || existingUser.name;
                existingUser.username = username || existingUser.username;
                existingUser.password = password || existingUser.password;
                existingUser.email = email || existingUser.email;
                const updatedUser = await Users.save(existingUser);
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating user:", error);
                return error;
            }
        },
        deleteUser: async (_, args) => {
            const user = await Users.find(args.id);
            if (!user) {
                throw new Error("User not found");
            }
            const deleted = await Users.delete(args.id);
            if (!deleted) {
                throw new Error("Failed to delete user");
            }
            return "User deleted successfully";
        }
    },
};
export default userResolvers;
//# sourceMappingURL=userResolvers.js.map