export interface TourStep {
  id: string;
  title: string;
  body: string;
  target?: string | string[];
  placement?: "top" | "bottom";
  openMenu?: boolean;
  preview?: "composer";
}

export const tourSteps: TourStep[] = [
  {
    id: "chat-list",
    title: "Your conversations",
    body: "Every chat shows up here. Tap a conversation to open it and start talking.",
    target: ['[data-tour="chat-item"]', '[data-tour="chat-empty"]'],
    placement: "bottom",
  },
  {
    id: "plus",
    title: "The + button",
    body: "Tap + any time to add a friend or start a group chat.",
    target: '[data-tour="plus-button"]',
    placement: "bottom",
  },
  {
    id: "add-friend",
    title: "Find and add friends",
    body: "Open Add Friend and search by phone number to send a request. Once they accept, you can start chatting.",
    target: '[data-tour="add-friend"]',
    placement: "bottom",
    openMenu: true,
  },
  {
    id: "requests",
    title: "Friend requests",
    body: "When someone sends you a request, a number appears here. Open it to accept or reject.",
    target: ['[data-tour="friend-requests"]', '[data-tour="add-friend"]'],
    placement: "bottom",
    openMenu: true,
  },
  {
    id: "composer",
    title: "Sending messages",
    body: "Inside a chat, type in the message box and tap send. Press and hold one of your own messages to edit or delete it.",
    preview: "composer",
  },
  {
    id: "profile",
    title: "Your profile",
    body: "Change your photo, name and other details here.",
    target: '[data-tour="tab-profile"]',
    placement: "top",
  },
  {
    id: "settings",
    title: "Settings and help",
    body: "Switch to dark mode, manage notifications or log out in More. You can replay this tour from there whenever you like.",
    target: '[data-tour="tab-more"]',
    placement: "top",
  },
];