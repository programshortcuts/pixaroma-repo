// change-tutorial-link.js
export function getTutorialLink() {
    return document.querySelector('#tutorialLink');
}

export function changeTutorialLink(source) {
    const tutorialLink = getTutorialLink();
    if (!tutorialLink) return;

    let el = null;

    if (source instanceof Element) {
        el = source;
    } else if (source?.target instanceof Element) {
        el = source.target.closest('[data-video]');
    } else if (source?.closest) {
        el = source.closest('[data-video]');
    }

    if (!el?.dataset?.video) return;

    const vidBase = el.dataset.video;
    const ts = el.dataset.timestamp;
    console.log(ts)
    tutorialLink.href = ts
        ? `${vidBase}${vidBase.includes('?') ? '&' : '?'}t=${ts}s`
        : vidBase;
        // console.log(source)
        // console.log(tutorialLink)
}