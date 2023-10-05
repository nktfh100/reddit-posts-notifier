import { getHistory, saveHistory } from "./history";
import { log, sleep } from "./utils";

import getFeedItems from "./rss";
import { sendDiscordNotification } from "./providers/discord";
import { sendPushBulletNotification } from "./providers/pushbullet";

const WORDS_IGNORE: string = process.env.WORDS_IGNORE || "";

export default async function fetchNewPosts(subreddit: string): Promise<void> {
	log(`Checking for new posts... (r/${subreddit})`);
	let items = await getFeedItems(subreddit);

	if (items.length == 0) {
		return;
	}

	const history = await getHistory();

	// Only keep items from the previous 30 minutes
	items = items.filter((item) => {
		const isoDate = item.isoDate;
		return (
			isoDate &&
			(new Date().getTime() - new Date(isoDate).getTime()) / 1000 / 60 <=
				30
		);
	});

	// Remove items that were already posted
	items = items.filter((item) => !history.includes(item.title));

	// Remove items that contain ignored words
	const keywords: string[] = WORDS_IGNORE.split(",");
	if (keywords && keywords.length > 0) {
		items = items.filter(
			(item) =>
				!keywords.some((keyword) =>
					item.title!.toLowerCase().includes(keyword)
				)
		);
	}

	if (items.length == 0) {
		return;
	}

	items.forEach(async (item) => {
		history.push(item.title);
		await sendPost(item, subreddit);
		await sleep(1000);
	});

	saveHistory(history);
}

async function sendPost(data: any, subreddit: string): Promise<void> {
	switch (process.env.NOTIFICATIONS_PROVIDER) {
		case "discord":
			await sendDiscordNotification(data, subreddit);
			break;
		case "pushbullet":
			await sendPushBulletNotification(data, subreddit);
		default:
			log("No notifications provider was set!");
			break;
	}
}
