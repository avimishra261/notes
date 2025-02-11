import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export async function changeStatusbarColor(isDarkMode: boolean) {
	if (Capacitor.getPlatform() === "android") {
		if (isDarkMode) {
			await StatusBar.setBackgroundColor({ color: "#272727" });
		} else {
			await StatusBar.setBackgroundColor({ color: "#ff5722" });
		}
		await StatusBar.setStyle({ style: Style.Dark });
	}
}

export async function setStatusbarColor(color: string, style?: Style) {
	await StatusBar.setBackgroundColor({ color });

	if (style) {
		await StatusBar.setStyle({ style });
	}
}
