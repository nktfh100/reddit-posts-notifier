import axios from "axios";
import cache from "memory-cache";

const sleep = (time: number) => new Promise((res) => setTimeout(res, time));

export async function getSubredditPic(subreddit: string): Promise<string> {
	if (cache.get(subreddit) != null) {
		return cache.get(subreddit);
	}

	try {
		const res = await axios.get(
			`https://www.reddit.com/r/${subreddit}/about.json`
		);
		const img = res.data.data.icon_img;
		cache.put(subreddit, img);
		return img;
	} catch (error) {
		log(error);
		cache.put(subreddit, "");
		return ``;
	}
}

export async function getUserProfilePic(user: string): Promise<string> {
	try {
		const res = await axios.get(
			`https://www.reddit.com/${user}/about.json`
		);
		const url = res.data.data.icon_img;
		const urlObj = new URL(url);
		urlObj.search = "";
		return urlObj.toString();
	} catch (error) {
		log(error);
		return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png`;
	}
}

function log(...args: any[]): void {
	const timestamp = new Date().toISOString();
	console.log(timestamp, ...args);
}

export { sleep, log };
