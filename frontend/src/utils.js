export function formatDateFromISOString(isoString, options) {
  // Convert the ISO string to a Date object
  const dateObject = new Date(isoString);

  // Default options if none are provided
  const defaultOptions = { year: "numeric", month: "long", day: "numeric" };

  // Use the provided options or fallback to default options
  const formatOptions = options || defaultOptions;

  // Format the date
  return dateObject.toLocaleDateString(undefined, formatOptions);
}
export function sortItemsByDateDescending(items) {
  return items.sort((a, b) => {
    const dateA = new Date(a.addedAt);
    const dateB = new Date(b.addedAt);
    return dateB - dateA; // Compare in descending order
  });
}
export function filterItemsFromLastWeek(items) {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date one week ago
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter the items
  return items.filter((item) => {
    const itemDate = new Date(item.addedAt);
    return itemDate >= oneWeekAgo && itemDate <= currentDate;
  });
}

// Custom format options
export const customOptions = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
};

// Another custom format
export const timeOptions = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};
