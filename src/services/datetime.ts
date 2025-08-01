export function formateDate(date: any) {
  if (date) return new Date(date).toLocaleString();
}
