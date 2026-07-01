// script.js
// THIS CODE IS ALL over ThE Place, fix, make more like tech-with-tim!
// ===== Imports =====
import { keyboardNav } from "../nav/keyboard-nav.js";

// import { popupLetterNav } from "../ui/letter-nav-popup.js";
import { letterNav } from "../nav/letter-nav.js";
import { initEscapeReset } from "../ui/toggle-img-sizes.js";
import { bindMainFocusReset } from "../ui/toggle-img-sizes.js";
import { initAllVideos } from "../ui/video-controls.js";
import { letterFocus } from "../nav/letter-focus.js";
import { getFocusZone } from "../nav/get-focus-zone.js";
import { initDropDowns } from "../ui/drop-downs-sidebar-temp.js";
import { intiSideBarLinkAutoFocus } from "../nav/side-bar-nav.js";
import { initStepNavigation, lastStep } from "../nav/step-nav.js";
import { initMediaClicks } from "../ui/toggle-img-sizes.js";
import {
    initToggleSidebar,
    mainContainer,
    sideBarBtn
} from "../ui/toggle-side-bar.js";

import {
    sideBarNav,
    lastClickedSideBarLink,
    lastFocusedSideBarLink
} from "../nav/side-bar-nav.js";

import { mainContentNav, mainTargetDiv } from "../nav/main-content-nav.js";
export const navBarLessonTitle = document.querySelector('#navBarLessonTitle');
export const pageWrapper = document.querySelector('.page-wrapper')
let isLetterNavEnabled = false
// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', initMain);
function initMain() {
    if (window._mainScriptInitialized) return;
    window._mainScriptInitialized = true;
    intiSideBarLinkAutoFocus()
    initDropDowns();
    initToggleSidebar();
    initMediaClicks()
    initStepNavigation({ mainTargetDiv });
    initAllVideos(mainTargetDiv);
    setupGlobalKeyListener();
    bindMainFocusReset(mainTargetDiv)
}

// =========================
// GLOBAL KEY ROUTER
// =========================

function setupGlobalKeyListener() {

    addEventListener('keydown', e => {
        /** The e.preventDefault to if(isTyping) means: prevents bugs*/
        if (e.defaultPrevented) return
        const tag = e.target.tagName
        const isTyping =
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            e.target.isContentEditable

        if (isTyping) return

        keyboardNav({ e })
    });
}