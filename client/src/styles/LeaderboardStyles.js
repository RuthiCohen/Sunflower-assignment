const COLORS = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  regular: "#888",
};

export const getCardStyle = (index) => {
  switch (index) {
    case 0:
      return { backgroundColor: "#ffd70022" };
    case 1:
      return { backgroundColor: "#c0c0c022" };
    case 2:
      return { backgroundColor: "#cd7f3222" };
    default:
      return {};
  }
};

export const getCrownColor = (index) => {
  switch (index) {
    case 0:
      return COLORS.gole;
    case 1:
      return COLORS.silver;
    case 2:
      return COLORS.bronze;
    default:
      return COLORS.regular;
  }
};
