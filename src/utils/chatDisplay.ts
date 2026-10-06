import type { ChatListItem } from '../types/api.ts'

export const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=12'

export const chatName = (c: ChatListItem) =>
  c.type === 'group' ? (c.group?.name ?? 'Group') : (c.friend?.name ?? 'Unknown')

// null = a group without a picture (the UI shows a group icon instead)
export const chatAvatar = (c: ChatListItem): string | null =>
  c.type === 'group'
    ? c.group?.profile_picture || null
    : c.friend?.profile_picture || FALLBACK_AVATAR

export const chatPreview = (c: ChatListItem, isMine: (senderId: number) => boolean) => {
  const m = c.last_message
  if (!m) return 'No messages yet'
  const text = m.is_deleted ? 'This message was deleted' : (m.message ?? '')
  return isMine(m.sender_id) ? `You: ${text}` : text
}