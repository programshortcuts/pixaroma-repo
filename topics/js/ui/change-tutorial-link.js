// change-tutorial-link.js
export function getTutorialLink() {
    return document.querySelector('#tutorialLink');
}

export function changeTutorialLink(source) {
    const tutorialLink = document.querySelector('#tutorialLink');
    if (!tutorialLink) return;

    // Normalize input → always get an element
    const el =
        source instanceof Element
            ? source
            : source?.target instanceof Element
                ? source.target
                : null;

    // Find nearest element that actually has video data
    const videoEl = el?.closest?.('[data-video]');
    if (!videoEl) return;

    const vidBase = videoEl.dataset.video;
    const ts = videoEl.dataset.timestamp;

    tutorialLink.dataset.timestamp = ts || '';

    tutorialLink.href = ts
        ? `${vidBase}&t=${ts}s`
        : vidBase;
    console.log(tutorialLink)
}