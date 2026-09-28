import { computed, ref } from 'vue'

export interface Person {
  id: number
  name: string
  phone: string // display format, e.g. "(+44) 50 9285 3022"
  avatar: string
}

const av = (n: number) => `https://i.pravatar.cc/150?img=${n}`

// ── mock data: replace with API calls ─────────────────────────
/** everyone you can find by typing a phone number */
const directory: Person[] = [
  { id: 101, name: 'David Wayne', phone: '(+44) 50 9285 3022', avatar: av(1) },
  { id: 102, name: 'Edward Mint', phone: '(+44) 50 9285 2090', avatar: av(2) },
  { id: 103, name: 'May HG. Kang', phone: '(+44) 50 9285 2214', avatar: av(3) },
  { id: 104, name: 'Lily Dare', phone: '(+44) 50 9285 5530', avatar: av(4) },
  { id: 105, name: 'Dennis Dang', phone: '(+44) 50 9285 2225', avatar: av(5) },
  { id: 106, name: 'Cayla Raiji', phone: '(+44) 50 9285 2529', avatar: av(6) },
  { id: 107, name: 'Erin Turcotte', phone: '(+44) 50 9285 1559', avatar: av(7) },
  { id: 108, name: 'Bob Walter', phone: '(+44) 50 9285 2355', avatar: av(8) },
]

const contacts = ref<Person[]>([
  { id: 1, name: 'David Wayne', phone: '(+44) 50 9285 3022', avatar: av(1) },
  { id: 2, name: 'Edward Davidson', phone: '(+44) 12 8025 2090', avatar: av(2) },
  { id: 3, name: 'Angela Kelly', phone: '(+44) 23 6091 2214', avatar: av(3) },
  { id: 4, name: 'Jean Dare', phone: '(+1) 633 983 5730', avatar: av(4) },
  { id: 5, name: 'Dennis Borer', phone: '(+1) 112 919 2225', avatar: av(5) },
  { id: 6, name: 'Cayla Rath', phone: '(+61) 797 982 529', avatar: av(6) },
  { id: 7, name: 'Erin Turcotte', phone: '(+61) 362 901 559', avatar: av(7) },
  { id: 8, name: 'Rodolfo Walter', phone: '(+1) 529 100 2355', avatar: av(8) },
])

const requests = ref<Person[]>([
  { id: 201, name: 'Mia Cole', phone: '(+44) 77 1234 5678', avatar: av(9) },
  { id: 202, name: 'Noah Reed', phone: '(+44) 78 4321 8765', avatar: av(10) },
  { id: 203, name: 'Zara Ali', phone: '(+1) 415 555 0134', avatar: av(11) },
])

const sentIds = ref<number[]>([])

const nationalDigits = (phone: string) => phone.replace(/^\(\+\d+\)\s*/, '').replace(/\D/g, '')

// module-level state => shared by every screen that calls useContacts()
export function useContacts() {
  const pendingCount = computed(() => requests.value.length)

  const searchDirectory = (digits: string) =>
    digits ? directory.filter((p) => nationalDigits(p.phone).includes(digits)) : []

  const isRequested = (id: number) => sentIds.value.includes(id)
  const sendRequest = (id: number) => {
    if (!isRequested(id)) sentIds.value.push(id) // TODO: POST /friend-requests
  }

  const acceptRequest = (id: number) => {
    const person = requests.value.find((r) => r.id === id)
    if (person) contacts.value.push(person) // TODO: POST /friend-requests/:id/accept
    requests.value = requests.value.filter((r) => r.id !== id)
  }
  const rejectRequest = (id: number) => {
    requests.value = requests.value.filter((r) => r.id !== id) // TODO: DELETE ...
  }

  return { contacts, requests, pendingCount, searchDirectory, isRequested, sendRequest, acceptRequest, rejectRequest }
}