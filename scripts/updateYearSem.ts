// import { updateAllSubjectYearSem } from "@/lib/actions";

// async function main() {
//   console.log("Starting yearSem update for all subjects...\n");

//   try {
//     const result = await updateAllSubjectYearSem();

//     // Check if the operation failed
//     if (result.error) {
//       console.error("\n Update failed:", result.message);
//       process.exit(1);
//     }

//     // Check if there were errors during individual updates
//     if (result.data && result.data.errors > 0) {
//       console.warn("\nUpdate completed with some errors");
//       process.exit(1);
//     }

//     console.log("\n Update completed successfully!");
//     console.log(result.message);
//     process.exit(0);
//   } catch (error) {
//     console.error("\n Update failed:", error);
//     process.exit(1);
//   }
// }

// main();
