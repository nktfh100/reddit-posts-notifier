import dotenv from "dotenv";
import { log } from "./utils";
import startMonitoring from "./monitor";

dotenv.config();

const SUBREDDITS: string = process.env.SUBREDDITS || "";

function main(): void {
	const subreddits: string[] = SUBREDDITS.split(",");
	if (!subreddits) {
		return log("No subreddits were provided!");
	}

	subreddits.forEach(startMonitoring);
}

main();
