// Lets any component (e.g. the hero CTA) open the Avix chatbot without prop drilling.
const OPEN_EVENT = "chatbot:open";

export function openChatbot() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onChatbotOpen(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
