import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { friendService } from "../services/api.ts";
import type {
  FriendSuggestion,
  FriendUser,
  IncomingFriendRequest,
  RespondAction,
} from "../types/api.ts";

export const useFriendsStore = defineStore("friends", () => {
  // search
  const searchResult = ref<FriendUser | null>(null);
  const searching = ref(false);
  const hasSearched = ref(false);
  let searchToken = 0; // ignores stale responses if the user keeps typing

  // requests
  const requests = ref<IncomingFriendRequest[]>([]);
  const loadingRequests = ref(false);
  const sentIds = ref<number[]>([]);
  const sendingTo = ref<number | null>(null);
  const responding = ref<{ id: number; action: RespondAction } | null>(null);

  // suggestions
  const suggestions = ref<FriendSuggestion[]>([]); // short preview list (random)
  const loadingSuggestions = ref(false);
  const allSuggestions = ref<FriendSuggestion[]>([]); // full list, loaded page by page
  const loadingAll = ref(false);
  const allPage = ref(0);
  const allLastPage = ref(1);

  const pendingCount = computed(() => requests.value.length);
  const hasMoreAll = computed(() => allPage.value < allLastPage.value);

  async function search(phone: string) {
    const token = ++searchToken;
    searching.value = true;
    hasSearched.value = false;
    searchResult.value = null;
    try {
      const res = await friendService.search(phone);
      if (token === searchToken) searchResult.value = res.data;
    } catch {
      // not found (the interceptor already toasted); the page shows the empty state
    } finally {
      if (token === searchToken) {
        searching.value = false;
        hasSearched.value = true;
      }
    }
  }

  function clearSearch() {
    searchToken++; // invalidates any in-flight search
    searching.value = false;
    hasSearched.value = false;
    searchResult.value = null;
  }

  async function sendRequest(receiverId: number) {
    if (sendingTo.value !== null || sentIds.value.includes(receiverId)) return false;
    sendingTo.value = receiverId;
    try {
      const res = await friendService.sendRequest(receiverId);
      sentIds.value.push(receiverId);
      toast.success(res.message);
      return true;
    } catch {
      return false;
    } finally {
      sendingTo.value = null;
    }
  }

  async function fetchRequests(silent = false) {
    loadingRequests.value = true;
    try {
      const res = await friendService.getRequests(silent);
      requests.value = res.data.filter((r) => r.status === "pending");
      return true;
    } catch {
      return false;
    } finally {
      loadingRequests.value = false;
    }
  }

  async function respond(requestId: number, action: RespondAction) {
    if (responding.value) return false;
    responding.value = { id: requestId, action };
    try {
      const res = await friendService.respond(requestId, action);
      requests.value = requests.value.filter((r) => r.friend_request_id !== requestId);
      toast.success(res.message);
      return true;
    } catch {
      return false;
    } finally {
      responding.value = null;
    }
  }

  // ── suggestions ──────────────────────────────────────
  // a few random people (the featured account is always first)
  async function fetchSuggestions() {
    if (loadingSuggestions.value) return false;
    loadingSuggestions.value = true;
    try {
      const res = await friendService.getSuggestions(10);
      suggestions.value = res.data;
      return true;
    } catch {
      return false;
    } finally {
      loadingSuggestions.value = false;
    }
  }

  // everyone the user can still add, one page at a time (page 1 resets the list)
  async function fetchAllSuggestions(page = 1) {
    if (loadingAll.value) return false;
    loadingAll.value = true;
    try {
      const res = await friendService.getAllSuggestions(page);
      const incoming = res.data.data;

      if (page === 1) {
        allSuggestions.value = incoming;
      } else {
        const known = new Set(allSuggestions.value.map((s) => s.id));
        allSuggestions.value = [
          ...allSuggestions.value,
          ...incoming.filter((s) => !known.has(s.id)),
        ];
      }

      allPage.value = res.data.current_page;
      allLastPage.value = res.data.last_page;
      return true;
    } catch {
      return false;
    } finally {
      loadingAll.value = false;
    }
  }

  const loadMoreSuggestions = () =>
    hasMoreAll.value
      ? fetchAllSuggestions(allPage.value + 1)
      : Promise.resolve(false);

  // call on logout so the next user doesn't see this user's data
  function reset() {
    clearSearch();
    requests.value = [];
    sentIds.value = [];
    suggestions.value = [];
    allSuggestions.value = [];
    allPage.value = 0;
    allLastPage.value = 1;
  }

  return {
    searchResult, searching, hasSearched,
    requests, loadingRequests, sentIds, sendingTo, responding, pendingCount,
    suggestions, loadingSuggestions, allSuggestions, loadingAll, hasMoreAll,
    search, clearSearch, sendRequest, fetchRequests, respond,
    fetchSuggestions, fetchAllSuggestions, loadMoreSuggestions, reset,
  };
});