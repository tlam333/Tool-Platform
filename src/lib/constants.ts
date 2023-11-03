export const ToolCategories = [
  "Power Tools",
  "Automotive",
  "Heavy Machinery",
  "Hand Tools",
  "Gardening",
  "Trailers",
  "Agricultural",
  "Cleaning",
  "Access Equipment",
  "Other",
];
export const RentalPeriods = ["Per Hour", "Per Day", "Per Week", "Per Month"];
export const ToolPlaceholderImg = `/image-placeholder.png`;
export const Colors = [
  "primary",
  "default",
  "warning",
  "success",
  "error",
  "info",
  "dark",
  "light",
  "white",
  "black",
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
];
export const imageUrl =
  "https://" +
  process.env.NEXT_PUBLIC_AWS_BUCKET_NAME +
  ".s3." +
  process.env.NEXT_PUBLIC_AWS_REGION +
  ".amazonaws.com/";
export const stripeFeesPercentage = 0.0175; // 1.75%
export const stripeFeesFixed = 0.3; // 30 cents
