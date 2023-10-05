import fs from "fs/promises";
import { log } from "./utils";

async function getHistory(): Promise<any[]> {
	try {
		const data = await fs.readFile("./data/history.json", "utf8");
		return JSON.parse(data).history;
	} catch (error) {
		if (error && !error.toString().includes("no such file or directory")) {
			log(error);
		}
		return [];
	}
}

async function saveHistory(newHistory: any[]): Promise<void> {
	while (newHistory.length >= 30) {
		newHistory.shift();
	}

	await fs.writeFile(
		"./data/history.json",
		JSON.stringify({ history: newHistory }),
		"utf8"
	);
}

export { getHistory, saveHistory };
