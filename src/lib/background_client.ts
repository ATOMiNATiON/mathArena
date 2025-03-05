import { actions } from "astro:actions";

export async function getTheme(): Promise<string> {
  const themeBox = document.getElementById("side-menu-container")!;
  if (!themeBox.classList.contains("hidden")) return getUserThemeFirebase();
  else throw new Error("Theme not loaded?");
}

export async function getUserThemeFirebase(): Promise<string> {
  const theme = await actions.getTheme();
  return theme.data!;
}
