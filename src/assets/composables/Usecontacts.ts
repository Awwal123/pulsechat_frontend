import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useFriendsStore } from "../../store/friends.ts";
import { friendService } from "../../services/api.ts";

export interface Person {
  id: number;
  name: string;
  phone: string;
  avatar: string;
}

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?img=12";

const contacts = ref<Person[]>([]);
const loadingContacts = ref(false);

async function fetchContacts(silent = false) {
  loadingContacts.value = true;
  try {
    const res = await friendService.getFriends(silent);
    contacts.value = res.data.map(({ friend }) => ({
      id: friend.id,
      name: friend.name,
      phone: friend.phone,
      avatar: friend.profile_picture || FALLBACK_AVATAR,
    }));
    return true;
  } catch {
    return false;
  } finally {
    loadingContacts.value = false;
  }
}

export function useContacts() {
  const friends = useFriendsStore();
  const { requests, pendingCount } = storeToRefs(friends);
  const refreshRequests = () => friends.fetchRequests(true);

  return { contacts, loadingContacts, fetchContacts, requests, pendingCount, refreshRequests };
}