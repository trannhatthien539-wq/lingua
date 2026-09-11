export const dateKey = (date = new Date()) => {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDaysKey = (days, from = new Date()) => {
  const value = new Date(from);
  value.setDate(value.getDate() + days);
  return dateKey(value);
};

export const imageUrlForWord = (word = "word") => `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(word)}`;