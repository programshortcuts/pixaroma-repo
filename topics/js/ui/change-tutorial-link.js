export const tutorialLink = document.querySelector('#tutorialLink');

export function changeTutorialLink(source) {
    if (!tutorialLink) return null;

    let el = null;

    if (source instanceof Element) {
        el = source;
    }
    else if (source?.target instanceof Element) {
        el = source.target.closest('[data-video]');
    }
    else if (source?.closest) {
        el = source.closest('[data-video]');
    }

    if (!el) return tutorialLink;

    const vidBase = el.dataset.video;
    const ts = el.dataset.timestamp;

    if (!vidBase) return tutorialLink;

    tutorialLink.href = ts
        ? `${vidBase}${vidBase.includes('?') ? '&' : '?'}t=${ts}s`
        : vidBase;

    return tutorialLink;
}

/* ✅ THIS IS THE ONLY COORDINATOR FUNCTION */
export function syncTutorialLink(sidebarEl, stepEl) {
    if (!tutorialLink) return;

    // 1. set base from sidebar
    if (sidebarEl) {
        changeTutorialLink(sidebarEl);
    }

    // 2. override timestamp from step
    if (stepEl) {
        changeTutorialLink(stepEl);
    }
}