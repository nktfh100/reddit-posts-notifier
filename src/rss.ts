import Parser from "rss-parser";
import { log } from "./utils";

const parser = new Parser({
	headers: {
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
	},
});

async function getFeedItems(subreddit: string): Promise<any[]> {
	try {
		const feed = await parser.parseURL(
			`https://www.reddit.com/r/${subreddit}/new/.rss?sort=new`
		);
		return feed.items;
	} catch (error) {
		log(error);
		return [];
	}
}

export default getFeedItems;
