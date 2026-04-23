import "dotenv/config";
import { clerkClient } from "@clerk/clerk-sdk-node";

async function deleteAllUsers() {
  const users = await clerkClient.users.getUserList();

  for (const user of users) {
    await clerkClient.users.deleteUser(user.id);
    console.log(`Deleted: ${user.id}`);
  }
}

deleteAllUsers();

//npm install @clerk/clerk-sdk-node
//npx tsx scripts/deleteClerkUsers.ts --> use this command to run the script
