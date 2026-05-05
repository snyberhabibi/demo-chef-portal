/**
 * Cuisine name → flag emoji mapping
 * Used across dish creation and profile cuisine selectors
 */

const cuisineEmojis: Record<string, string> = {
  palestinian: "🇵🇸",
  lebanese: "🇱🇧",
  syrian: "🇸🇾",
  jordanian: "🇯🇴",
  egyptian: "🇪🇬",
  iraqi: "🇮🇶",
  moroccan: "🇲🇦",
  tunisian: "🇹🇳",
  turkish: "🇹🇷",
  persian: "🇮🇷",
  iranian: "🇮🇷",
  indian: "🇮🇳",
  pakistani: "🇵🇰",
  mexican: "🇲🇽",
  italian: "🇮🇹",
  french: "🇫🇷",
  japanese: "🇯🇵",
  chinese: "🇨🇳",
  korean: "🇰🇷",
  thai: "🇹🇭",
  greek: "🇬🇷",
  spanish: "🇪🇸",
  american: "🇺🇸",
  yemeni: "🇾🇪",
  saudi: "🇸🇦",
  emirati: "🇦🇪",
  kuwaiti: "🇰🇼",
  afghan: "🇦🇫",
  ethiopian: "🇪🇹",
  somali: "🇸🇴",
  sudanese: "🇸🇩",
  libyan: "🇱🇾",
  algerian: "🇩🇿",
  "latin american": "🌮",
  arab: "🌍",
  mediterranean: "🫒",
  "middle eastern": "🧆",
  asian: "🥢",
  african: "🌍",
  latin: "🌮",
  european: "🇪🇺",
};

export function getCuisineEmoji(name: string): string {
  const key = name.toLowerCase().trim();
  return cuisineEmojis[key] || "🍽️";
}
