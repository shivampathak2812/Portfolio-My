// Shared resume constants + a tiny event bridge so any component (navbar, hero,
// contact, chatbot) can open the in-page resume viewer without prop drilling.

export const RESUME_URL = "/resume/Resume_Shivam.pdf";
export const RESUME_FILENAME = "Shivam_Pathak_Resume.pdf";
export const RESUME_HASH = "#resume";

const OPEN_EVENT = "resume-viewer:open";

export function openResumeViewer() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onResumeViewerOpen(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

// Programmatic download (used where we can't render an <a download> directly)
export function downloadResume() {
  const link = document.createElement("a");
  link.href = RESUME_URL;
  link.download = RESUME_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
