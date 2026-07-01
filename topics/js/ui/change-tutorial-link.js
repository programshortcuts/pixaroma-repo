// change-tutorial-link.js
export const tutorialLink = document.querySelector('#tutorialLink');

export function changeTutorialLink(source) {
    if (!tutorialLink) return null;

    // normalize → get an element no matter what was passed in
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
    console.log(tutorialLink)
    return tutorialLink;
}

export function syncTutorialLink(sidebarEl, stepEl) {
    if (!tutorialLink) return;

    if (sidebarEl?.dataset?.video) {
        changeTutorialLink(sidebarEl);
    }

    if (stepEl?.dataset?.timestamp) {
        changeTutorialLink(stepEl);
    }
}