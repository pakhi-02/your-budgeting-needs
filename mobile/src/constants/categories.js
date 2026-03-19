export const CATEGORY_EMOJIS = {
  Food: "🍜",
  Transport: "🚗",
  Entertainment: "🎮",
  Shopping: "🛍️",
  Bills: "💡",
  Health: "💊",
  Education: "📚",
  Rent: "🏠",
  Salary: "💼",
  Investment: "📈",
  Freelance: "💻",
  Gift: "🎁",
  Other: "📌",
};

export const CATEGORY_LIST = Object.entries(CATEGORY_EMOJIS).map(
  ([name, emoji]) => ({ name, emoji })
);

export const getCategoryEmoji = (category) =>
  CATEGORY_EMOJIS[category] || "📌";

export const CHART_COLORS = [
  "#FF6B9D",
  "#C471ED",
  "#12C2E9",
  "#4FD1C5",
  "#FC8181",
  "#9F7AEA",
  "#F6AD55",
  "#68D391",
  "#F687B3",
  "#63B3ED",
  "#FBD38D",
  "#B794F4",
  "#FEB2B2",
];
