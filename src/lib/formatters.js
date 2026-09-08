export const formatDate = (date = new Date()) => new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long', day: 'numeric', month: 'long',
}).format(date)
