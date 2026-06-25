// step-nav.js
/* =========================
   STEP NAVIGATION (CLEAN)
========================= */

import { pauseAllVideos } from "../ui/video-controls.js";
import { cycleMedia, denlargeAllImages } from "../ui/toggle-img-sizes.js";

import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { lastClickedSideBarLink } from "./side-bar-nav.js";
import { mainTargetDiv } from "./main-content-nav.js";
// import { mainTargetDiv } from "./main-content-nav.js";

let steps = [];
let currentIndex = 0;

export let lastStep = null;

/* =========================
   INIT
========================= */

export function initStepNavigation({ mainTargetDiv }) {
    if (!mainTargetDiv) return;

    steps = [...mainTargetDiv.querySelectorAll('.step-float')];
    currentIndex = 0;

    steps.forEach((step, index) => {
        step.setAttribute('tabindex', '0');

        step.addEventListener('focus', () => {
            lastStep = step;
            currentIndex = index;

            step.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });

        step.addEventListener('click', (e) => {
            changeTutorialLink(e);
        });

        step.addEventListener('pointerup', (e) => {
            changeTutorialLink(e);
        });

        step.addEventListener('touchend', (e) => {
            changeTutorialLink(e);
        });

        step.addEventListener('keydown', (e) => handleStepKey(e, step, index));
    });

    syncStep();
}

/* =========================
   KEY HANDLER (STEP ONLY)
========================= */

function handleStepKey(e, step, index) {
    const key = e.key.toLowerCase();
    const active = document.activeElement;

    if(e.target.tagName == 'A' && key == 'enter'){
        open(e.target.href, '_blank')
    }
    function getFirstFocusableChild(targetStep) {
        return [...targetStep.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
        )].find((el) => {
            if (el.matches('a, img, video, audio') || el.hasAttribute('disabled')) return false;
            return !el.closest('.vid-cntrl-btns');
        });
    }

    if (!step.contains(active)) return;

    changeTutorialLink(e);

    /* =========================
       SHIFT + ENTER → cycle media
    ========================= */
    if (key === 'enter' && e.shiftKey) {
        e.preventDefault();

        cycleMedia(step);
        return;
    }

    /* =========================
       ENTER → step action / media fallback
    ========================= */
    if (key === 'enter' && !e.shiftKey) {
        e.preventDefault();
        changeTutorialLink(e)
        const isDirectStepFocus = active === step;

        if (isDirectStepFocus) {
            const firstFocusableChild = getFirstFocusableChild(step);

            if (firstFocusableChild) {
                firstFocusableChild.focus();
                return;
            }
        }

        cycleMedia(step);
        return;
    }

    /* =========================
       M key (sidebar restore)
    ========================= */
    /* =========================
   M KEY
========================= */
    if (key === 'm') {
        
        // e.preventDefault();

        // const currentStep = e.target.closest('.step-float');
        // if (!currentStep) return;

        // currentStep.blur();

        // requestAnimationFrame(() => {
        //     if (!mainTargetDiv) return;

        //     // 1. focus it (optional but fine)
        //     mainTargetDiv.setAttribute('tabindex', '-1');
        //     mainTargetDiv.focus?.();

        //     // 2. scroll it to top (THIS is the missing piece)
        //     mainTargetDiv.scrollIntoView({
        //         behavior: 'smooth',
        //         block: 'start'
        //     });

        //     // fallback hard reset (important if container scroll is weird)
        //     setTimeout(() => {
        //         mainTargetDiv.scrollTop = 0;
        //         window.scrollTo({ top: 0, behavior: 'smooth' });
        //     }, 0);
        // });

        // return;
    }
}

/* =========================
   GLOBAL NAV (F / A / NUMBERS)
========================= */

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const active = document.activeElement;

    if (!steps.length) return;
    /* =========================
       COPY CODE NAVIGATION
    ========================= */

    const activeCopyCode =
        active?.classList?.contains('copy-code')
            ? active
            : null;

    if (activeCopyCode) {

        const parentStep =
            activeCopyCode.closest('.step-float');

        const copyCodes = [
            ...parentStep.querySelectorAll('.copy-code')
        ];

        const currentCodeIndex =
            copyCodes?.indexOf(activeCopyCode);
        if(!isNaN(key)){
            const intKey = parseInt(key)    
            copyCodes[intKey - 1]?.focus()
        }
        if (key === 'f') {
            e.preventDefault();

            const nextIndex =
                (currentCodeIndex + 1) %
                copyCodes.length;

            copyCodes[nextIndex]?.focus();
            return;
        }

        if (key === 'a') {
            e.preventDefault();

            const prevIndex =
                (currentCodeIndex - 1 + copyCodes.length) %
                copyCodes.length;

            copyCodes[prevIndex]?.focus();
            return;
        }

        if (key === 's') {
            e.preventDefault();
            lastClickedSideBarLink?.focus();
            return;
        }

        return;
    }

    /* =========================
       VIDEO BLOCK
    ========================= */

    const isVideo =
        active?.tagName === 'VIDEO';

    if (isVideo) {

        if (key === 's') {
            lastClickedSideBarLink?.focus();
        }

        return;
    }

    if (
        active?.closest?.('.side-bar') ||
        active?.id === 'sideBarBtn'
    ) return;

    const activeStep = active?.closest?.('.step-float');

    if (activeStep) {
        currentIndex = steps.indexOf(activeStep);
    }

    /* =========================
       NEXT (F)
    ========================= */
    if (key === 'f') {
        const isMainTargetFocused = active === mainTargetDiv;

        if (isMainTargetFocused) {
            currentIndex = 0;
            steps[currentIndex]?.focus();
            return;
        }

        currentIndex = (currentIndex + 1) % steps.length;
        steps[currentIndex]?.focus();
        return;
    }

    /* =========================
       PREV (A)
    ========================= */
    if (key === 'a') {
        currentIndex =
            (currentIndex - 1 + steps.length) % steps.length;

        steps[currentIndex]?.focus();
        return;
    }

    /* =========================
       NUMBER KEYS
    ========================= */
    if (key >= '1' && key <= '9') {
        const num = parseInt(key, 10) - 1;

        if (num < steps.length) {
            currentIndex = num;
            steps[currentIndex]?.focus();
        } 
        if(num >= steps.length) {
            currentIndex = steps.length - 1;
            steps[currentIndex]?.focus();
        }
       return;
    }
});

/* =========================
   SYNC
========================= */

function syncStep() {
    const active = document.activeElement;
    const step = active?.closest?.('.step-float');

    if (!step) {
        currentIndex = 0;
        return;
    }

    const idx = steps.indexOf(step);
    if (idx !== -1) currentIndex = idx;
}

/* =========================
   EXPOSE
========================= */

export function getLastStep() {
    return lastStep;
}