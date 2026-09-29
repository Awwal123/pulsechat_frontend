import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { friendService } from "../services/api.ts";
import type { FriendUser, IncomingFriendRequest, RespondAction } from "../types/api.ts";

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

  const pendingCount = computed(() => requests.value.length);

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

  // call on logout so the next user doesn't see this user's data
  function reset() {
    clearSearch();
    requests.value = [];
    sentIds.value = [];
  }

  return {
    searchResult, searching, hasSearched,
    requests, loadingRequests, sentIds, sendingTo, responding, pendingCount,
    search, clearSearch, sendRequest, fetchRequests, respond, reset,
  };
});