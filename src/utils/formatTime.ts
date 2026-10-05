const pad = (n: number) => String(n).padStart(2, "0");

// today -> "10:25 AM"
// older -> "10:20 PM 09/05"

export function formatChatTime(iso: string) {
  const d = new Date(iso);

  let hours = d.getHours();
  const minutes = pad(d.getMinutes());

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const time = `${hours}:${minutes} ${period}`;

  const now = new Date();

  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  return sameDay
    ? time
    : `${time} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}