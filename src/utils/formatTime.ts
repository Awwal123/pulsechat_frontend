const pad = (n: number) => String(n).padStart(2, "0");

// today -> "10:25", older -> "22:20 09/05" (same style as your mock data)
export function formatChatTime(iso: string) {
  const d = new Date(iso);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return sameDay ? time : `${time} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}