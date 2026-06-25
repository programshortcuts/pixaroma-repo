// toggle-img-sizes.js
/* =========================
   MEDIA SYSTEM (FINAL CLEAN VERSION)
========================= */

let mediaCache = [];

/* =========================
   INIT
========================= */
export function initMediaCache(root = document) {
    mediaCache = [...root.querySelectorAll('.step-img, .step-vid')];
}

export function refreshImages(root = document) {
    initMediaCache(root);
}

/* =========================
   GLOBAL RESET
========================= */
export function denlargeAllImages() {
    mediaCache.forEach(el => el.classList.remove('enlarge'));

    mediaCache.forEach(el => {
        const step = el.closest('.step-float');
        if (step) step.dataset.mediaIndex = -1;
    });
}

/* =========================
   STEP CYCLING
========================= */
export function cycleMedia(step) {
    if (!step) return;

    const items = [...step.querySelectorAll('.step-img, .step-vid')];
    if (!items.length) return;

    let index = Number(step.dataset.mediaIndex ?? -1);
    index++;

    if (index >= items.length) {
        items.forEach(el => el.classList.remove('enlarge'));
        step.dataset.mediaIndex = -1;
        return;
    }

    items.forEach(el => el.classList.remove('enlarge'));

    const active = items[index];
    active.classList.add('enlarge');

    step.dataset.mediaIndex = index;

    if (active.classList.contains('step-vid')) {
        active.querySelector('video')?.play();
    }
}

function isControlClick(e) {
    return (e.composedPath?.() || []).some((node) => {
        return node instanceof Element && node.matches?.('.vid-cntrl-btns, .playbtn, .fwdBtn, .rwdBtn');
    });
}

/* =========================
   CLICK HANDLER (BULLETPROOF)
========================= */
export function initMediaClicks(root = document) {

    root.addEventListener("click", (e) => {

        // Ignore all video controls so clicking them only affects the video.
        if (isControlClick(e)) return;

        const media = e.target.closest('.step-img, .step-vid');
        if (!media) return;

        const step = media.closest('.step-float');
        if (!step) return;

        const items = [...step.querySelectorAll('.step-img, .step-vid')];

        const wasActive = media.classList.contains('enlarge');

        items.forEach(el => el.classList.remove('enlarge'));
        step.dataset.mediaIndex = -1;

        if (!wasActive) {
            media.classList.add('enlarge');
            step.dataset.mediaIndex = items.indexOf(media);

            if (media.classList.contains('step-vid')) {
                media.querySelector('video')?.play().catch(() => {});
            }
        }

    });
}

/* =========================
   OUTSIDE CLICK RESET
========================= */
export function initGlobalMediaReset() {
    document.addEventListener('pointerdown', (e) => {

        if (
            e.target.closest('.step-img, .step-vid') ||
            isControlClick(e)
        ) return;

        denlargeAllImages();
    });
}

/* =========================
   FOCUS RESET
========================= */
export function bindMainFocusReset(mainTargetDiv) {
    if (!mainTargetDiv) return;

    mainTargetDiv.addEventListener('focusin', (e) => {
        if (e.target instanceof Element && e.target.closest('.vid-cntrl-btns, .playbtn, .fwdBtn, .rwdBtn')) {
            return;
        }

        denlargeAllImages();
    });
}

export function initEscapeReset() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            denlargeAllImages();
        }
    });
}