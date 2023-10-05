import { log, sleep } from "./utils";

import fetchNewPosts from "./fetchNewPosts";

const CHECK_INTERVAL: number =
	parseInt(process.env.CHECK_INTERVAL || "300") || 300;

export default async function startMonitoring(
	subreddit: string,
	index: number
): Promise<void> {
	log(`Starting to monitor r/${subreddit}...`);

	subreddit = subreddit.toLocaleLowerCase().trim();

	await sleep(index * 1000 * 60 * 2); // Add a delay to avoid rate limiting

	fetchNewPosts(subreddit);

	// Fetch new posts every X minutes
	setInterval(() => fetchNewPosts(subreddit), 1000 * CHECK_INTERVAL);
}
