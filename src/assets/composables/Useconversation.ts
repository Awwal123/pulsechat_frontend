import { reactive } from 'vue'
import { useContacts, type Person } from './Usecontacts'


export interface Message {
  id: number
  from: 'me' | number // 'me' or a contact id
  text: string
  time: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  title: string
  subtitle: string
  members: Person[] // the other people in the chat
}

// ── mock data: replace with API / websocket ──────────────────
const groups: Record<string, { title: string; memberIds: number[] }> = {
  g1: { title: '🎮 Game 🎮', memberIds: [1, 2] },
}

const messages = reactive<Record<string, Message[]>>({
  '1': [
    { id: 1, from: 1, text: "This is your delivery driver from Speedy Chow. I'm just around the corner from your place. 😊", time: '10:10' },
    { id: 2, from: 'me', text: 'Hi!', time: '10:10' },
    { id: 3, from: 'me', text: "Awesome, thanks for letting me know! Can't wait for my delivery. 🎉", time: '10:11' },
    { id: 4, from: 1, text: "No problem at all!\nI'll be there in about 15 minutes.", time: '10:11' },
    { id: 5, from: 1, text: "I'll text you when I arrive.", time: '10:11' },
    { id: 6, from: 'me', text: 'Great! 😊', time: '10:12' },
  ],
  g1: [
    { id: 1, from: 'me', text: 'Hi!', time: '10:10' },
    { id: 2, from: 'me', text: 'Great, thanks for letting me know!\nI really look forward to experiencing it soon. 🎉', time: '10:11' },
    { id: 3, from: 1, text: 'Does this update fix error 352 for the Engineer character?', time: '10:11' },
    { id: 4, from: 2, text: 'Oh!\nThey fixed it and upgraded the security further. 🚀', time: '10:14' },
    { id: 5, from: 'me', text: 'Great! 😊', time: '10:20' },
  ],
})

let nextId = 1000
const nowTime = () => new Date().toTimeString().slice(0, 5)

export function useConversation() {
  const { contacts } = useContacts()

  const personById = (id: number) => contacts.value.find((c) => c.id === id) ?? null

  /** returns null when the id doesn't exist, so the view can show a "not found" state instead of a blank page */
  const getConversation = (id: string): Conversation | null => {
    const group = groups[id]
    if (group) {
      const members = group.memberIds.map(personById).filter((p): p is Person => !!p)
      return { id, type: 'group', title: group.title, subtitle: `${members.length + 1} members`, members }
    }
    const person = personById(Number(id))
    if (!person) return null
    return { id, type: 'direct', title: person.name, subtitle: person.phone, members: [person] }
  }

  const getMessages = (id: string): Message[] => {
    if (!messages[id]) messages[id] = []
    return messages[id]
  }

  const sendMessage = (id: string, text: string) => {
    const clean = text.trim()
    if (!clean) return
    getMessages(id).push({ id: nextId++, from: 'me', text: clean, time: nowTime() }) // TODO: send via API/socket
  }

  return { getConversation, getMessages, sendMessage, personById }
}