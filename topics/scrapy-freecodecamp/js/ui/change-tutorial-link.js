// change-tutorial-link.js
export const tutorialLink = document.querySelector('#tutorialLink');
export function changeTutorialLink(source) {
    if (!tutorialLink) return null;

    // If an event was passed, use its target.
    const el = source?.target || source;

    if (!(el instanceof Element)) return tutorialLink;

    const link = el.closest('[data-video]');
    if (!link) return tutorialLink;

    const vidBase = link.dataset.video;
    const ts = link.dataset.timestamp;

    if (!vidBase) return tutorialLink;

    tutorialLink.href = ts
        ? `${vidBase}${vidBase.includes('?') ? '&' : '?'}t=${ts}s`
        : vidBase;

    return tutorialLink;
}