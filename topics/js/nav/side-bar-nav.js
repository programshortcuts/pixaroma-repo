// side-bar-nav.js
import { denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { pauseAllVideos } from "../ui/video-controls.js";
import { handleMKey } from "./m-key-handler.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { sideBar, sideBarBtn } from "../ui/toggle-side-bar.js";
import { injectContent } from "../core/inject-content.js";
import { mainTargetDiv } from "./main-content-nav.js";
import { lastStep } from "./step-nav.js";
import { hideTopicSnips } from "../ui/drop-downs-sidebar-temp.js";
/* =========================
   STATE
========================= */
export let allSideBarLinks = [...document.querySelectorAll('.side-bar-links a')];
export let lastClickedSideBarLink = null;
export let lastFocusedSideBarLink = null;
let sideBarFocused = false;
let iSideBarLinks = -1;
let suppressIndexUpdate = false;
export function updateLastClicked(link) {
    let i = allSideBarLinks.indexOf(link)
    lastClickedSideBarLink = allSideBarLinks[i]
    lastFocusedSideBarLink = allSideBarLinks[i]
}
export function getHrefFromLink(link) {
    let href = lastClickedSideBarLink.href
    return link?.getAttribute('href') || null;
}
/* =========================
   INITIAL LOAD
========================= */
export function intiSideBarLinkAutoFocus(){
    const autoLink = allSideBarLinks.find(el => el.hasAttribute('autofocus'));
    if (autoLink) {
        lastClickedSideBarLink = autoLink;
        lastFocusedSideBarLink = autoLink;
        injectContent(autoLink.href);
        changeTutorialLink(autoLink)
    } else {
        injectContent('home-page.html');
    }
}
/* =========================
   HELPERS
========================= */
function isVisible(el) {
    return el && el.offsetParent !== null;
}
function getVisibleLinks() {
    return allSideBarLinks.filter(isVisible);
}
function isSubLink(el) {
    return !!el.closest('.side-bar-links li ul li a');
}
function getParentTopLink(subLink) {
    const li = subLink.closest('ul')?.closest('li');
    return li?.querySelector(':scope > a');
}
/* =========================
   LINK LISTENERS
========================= */
allSideBarLinks.forEach((el, i) => {
    // CLICK
    el.addEventListener('click', e => {
        removeAllHighlights(allSideBarLinks)
        e.preventDefault();
        lastClickedSideBarLink = el;
        injectContent(el.href);
        changeTutorialLink(el);
    });
    // ENTER
    el.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        
        if (key === 'enter') {
            e.preventDefault();
            changeTutorialLink(el);
            if (lastFocusedSideBarLink == lastClickedSideBarLink &&
                !e.target.classList.contains('drop-down')
            ){
                const step1 = mainTargetDiv.querySelector('.step-float')
                step1.focus()
                return
            }
            lastClickedSideBarLink = el;
            injectContent(el.href);
        }
        if (key === 'm') {
            if (e.key.toLowerCase() === 'm') {
                // mainTargetDiv.focus();
            }
            return
        }
    });
    // FOCUS
    el.addEventListener('focus', () => {
        removeAllHighlights(allSideBarLinks)
        denlargeAllImages()
        pauseAllVideos()
        lastFocusedSideBarLink = el;
        if (!suppressIndexUpdate) {
            iSideBarLinks = i;
        }
        el.classList.add('highlight')
    });
});
/* =========================
   SIDEBAR FOCUS TRACKING
========================= */
sideBar.addEventListener('focusin', () => sideBarFocused = true);
sideBar.addEventListener('focusout', () => sideBarFocused = false);
/* =========================
   SIDEBAR BUTTON
========================= */
sideBarBtn.addEventListener('keydown', e => {
    if(e.key.toLowerCase() === 'enter' ){
        hideTopicSnips()
        console.log('here')
    }
    if (e.key.toLowerCase() === 's') {
        lastClickedSideBarLink.focus()
    }
    if (e.key.toLowerCase() === 'm') {
        mainTargetDiv.focus();
    }
    if (e.key.toLowerCase() === 'f') {
        e.preventDefault()
        iSideBarLinks = 0
        allSideBarLinks[0].focus()
        // mainTargetDiv.focus();
    }
    if (!isNaN(e.key)){
        const firstSideBarParents = document.querySelectorAll('.side-bar-links > li > a');
        const intLet = parseInt(e.key.toLowerCase())
        firstSideBarParents[intLet - 1].focus()
    }
});
sideBarBtn.addEventListener('focus', () => {
    // sideBar.scrollIntoView({ behavior: "smooth", block: "start",inline:'start' });
    scrollTo(0,0)
});
function removeAllHighlights(allSideBarLinks){
    allSideBarLinks.forEach(el => {
        if(el.classList.contains('highlight')){
            el.classList.remove('highlight')
        }
    })
}
/* =========================
   MAIN KEYBOARD NAV
========================= */
export function sideBarNav({ e, focusZone }) {
    if (focusZone !== 'sideBar') return;
    if (e.target === sideBarBtn) {
        return
    }
    if (!e?.key) return;
    const key = e.key.toLowerCase();
    const activeEl = document.activeElement;
    const visibleLinks = getVisibleLinks();
    /* ---- NUMBER KEYS ---- */
    if (!isNaN(key)) {
        const index = parseInt(key) - 1;
        if (isSubLink(activeEl)) {
            const ul = activeEl.closest('ul');
            const subs = [...ul.querySelectorAll('li > a')].filter(isVisible);
            subs[index]?.focus();
            subs[index]?.scrollIntoView({ behavior: "smooth", block: "center", inline: 'center' });
        } else {
            visibleLinks[index]?.focus()
            visibleLinks[index]?.scrollIntoView({ behavior: "smooth", block: "center", inline: 'center' });
        }
        return;
    }
    /* ---- FORWARD / BACK ---- */
    if (key === 'f' || key === 'a') {
        suppressIndexUpdate = true;
        let current = visibleLinks.indexOf(activeEl);
        if (current === -1) current = 0;
        const delta = key === 'f'
            ? (e.shiftKey ? -1 : 1)
            : -1;
        const next = (current + delta + visibleLinks.length) % visibleLinks.length;
        visibleLinks[next].focus();
        iSideBarLinks = allSideBarLinks.indexOf(visibleLinks[next]);
        suppressIndexUpdate = false;
        return;
    }
    /* ---- S KEY ---- */
    if (key === 's') {
        if (isSubLink(activeEl)) {
            const parent = getParentTopLink(activeEl);
            if (parent) {
                parent.focus();
                iSideBarLinks = allSideBarLinks.indexOf(parent);
                return;
            }
        } else {
            sideBarBtn.focus();
            return;
        }
    }
    /* ---- T KEY ---- */
    if (key === 't') {
        tutorialLink?.focus();
        // changeTutorialLink(e.target)
    }
}
