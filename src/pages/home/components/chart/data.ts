const stat = "January, February, March, April, May, June"
  .split(",")
  .map((month) => {
    month = month.trim();
    return {
      x: month,
      y: (Math.random() * 1000).toFixed(1),
    };
  });

export const data = [
  {
    id: "revenue",
    color: "hsl(109, 70%, 50%)",
    data: stat,
  },
];
