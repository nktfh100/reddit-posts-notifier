import axios from "axios";
import { log } from "../utils";

export async function sendPushBulletNotification(
	data: any,
	subreddit: string
): Promise<void> {
	log("Sending pushbullet notification... " + data.title);

	if (!process.env.PUSHBULLET_TOKEN) return log("Pushbullet token not found");

	let body = data.contentSnippet.split("submitted by    /u/")[0];

	body = body + `\n\nr/${subreddit}`;

	const pushBulletData = {
		type: "link",
		title: data.title,
		body,
		url: data.link,
	};

	try {
		await axios.post(
			"https://api.pushbullet.com/v2/pushes",
			pushBulletData,
			{
				headers: {
					"Access-Token": process.env.PUSHBULLET_TOKEN,
				},
			}
		);
	} catch (error) {
		log(error);
	}
}
