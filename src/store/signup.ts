import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "../services/api";

export const useSignupStore = defineStore("signup", () => {
  const name = ref("");
  const profilePicture = ref<string | undefined>();
  const uploading = ref(false);
  let uploadedFile: File | null = null;

  async function uploadAvatar(file: File) {
    if (file === uploadedFile) return true; // already uploaded, skip on back/forward
    uploading.value = true;
    try {
      const res = await authService.uploadImage(file);
      profilePicture.value = res.data.url;
      uploadedFile = file;
      return true;
    } catch {
      return false;
    } finally {
      uploading.value = false;
    }
  }

  function reset() {
    name.value = "";
    profilePicture.value = undefined;
    uploadedFile = null;
  }

  return { name, profilePicture, uploading, uploadAvatar, reset };
});