// Smooth-scroll to an in-page section by hash (e.g. "#work").
// The contact footer is a sticky layer pinned under the page, so
// scrollIntoView sees it as already on screen and does nothing; it is
// revealed by scrolling to the very bottom instead.
export default function scrollToSection(hash) {
  if (hash === '#contact') {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    return;
  }
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
}
