// main-content-nav.js
import { denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { tutorialLink } from "../ui/change-tutorial-link.js";
import { handleMKey } from "./m-key-handler.js";
import {
    mainContainer,
    navBarLessonTitle,
    sideBarBtn
} from "../ui/toggle-side-bar.js";

import { lastClickedSideBarLink } from "./side-bar-nav.js";
import { nxtBtn, prevBtn } from "../core/inject-content.js";

export const mainTargetDiv = document.querySelector('#mainTargetDiv');
// export initMainTargetDiv

// =========================
// MAIN NAV ROUTER
// =========================
export function mainContentNav({ e, focusZone }) {
    console.log(e.target)
    const key = e.key?.toLowerCase();
    if (key === 'enter' && e.target == mainTargetDiv){
        const step = mainContainer.querySelector('.step-float')
        step.focus()
    }
    if (!key) return;
    const active = document.activeElement;

    // ONLY main content links
    const mainLink = active?.closest?.('#mainTargetDiv a');

    if (mainLink) {
        // LET BROWSER HANDLE ENTER/CLICK NATURALLY
        return;
    }
    // =========================
    // DO NOT INTERFERE WITH MEDIA
    // =========================
    const isMedia =
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code');

    if (isMedia && key !== 't') {
        return;
    }

    // =========================
    // M KEY → RETURN TO STEP / MAIN
    // =========================
    if (key === 'm') {
        console.log('here')
        handleMKey({ e, focusZone });
        return;
    }

    // =========================
    // NEXT / PREV LESSON
    // =========================
    if (key === 'e') {

        nxtBtn?.focus?.();
        mainContainer?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'end'
        });

        return;
    }

    if (key === 'p') {

        prevBtn?.focus?.();
        return;
    }
    

    // =========================
    // HEADER / NAV SHORTCUTS
    // =========================
    if (key === 'n') {

        navBarLessonTitle?.focus?.();
        return;
    }

    if (key === 's') {

        if (mainContainer.classList.contains('collapsed')) {
            sideBarBtn?.focus?.();
            return;
        }

        if (lastClickedSideBarLink) {
            lastClickedSideBarLink.focus();
        } else {
            sideBarBtn?.focus?.();
        }

        return;
    }
    if (key === 't') {
        tutorialLink.focus()
        return;
    }
    // =========================
    // (IMPORTANT)
    // DO NOT HANDLE STEP NAV HERE ANYMORE
    // =========================
    // Step system is fully handled inside step-nav.js
    if(key === 'escape'){
        denlargeAllImages()
    }
}