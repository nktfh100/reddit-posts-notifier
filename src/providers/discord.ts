import { EmbedBuilder, WebhookClient } from "discord.js";
import { getSubredditPic, getUserProfilePic, log } from "../utils";

const webHookUrl: string = process.env.WEBHOOK_URL || "";

let webhookClient: WebhookClient | null = null;

if (process.env.NOTIFICATIONS_PROVIDER === "discord" && webHookUrl != "") {
	webhookClient = new WebhookClient({
		url: webHookUrl.replace("discordapp", "discord"),
	});
}

export async function sendDiscordNotification(
	data: any,
	subreddit: string
): Promise<void> {
	log("Sending discord notification... " + data.title);

	if (!webhookClient) return log("Webhook client is null!");

	let description = data.contentSnippet;

	description =
		`<t:${Math.floor(new Date(data.isoDate).getTime() / 1000)}:R>\n` +
		description;
	description = description.split("submitted by    /u/")[0];

	if (description.length >= 4096) {
		description = description.slice(0, 4093) + "...";
	}

	const subredditPic = await getSubredditPic(subreddit);

	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(data.title)
		.setURL(data.link)
		.setAuthor({
			name: data.author,
			iconURL: await getUserProfilePic(data.author),
			url: `https://reddit.com${data.author}`,
		})
		.setDescription(description)
		.setTimestamp(new Date(data.isoDate));

	if (subredditPic != "") {
		embed.setThumbnail(subredditPic);
	}

	await webhookClient.send({
		embeds: [embed],
		content: process.env.ROLE_ID
			? `<@&${process.env.ROLE_ID}> ${data.title}`
			: "",
	});
}
