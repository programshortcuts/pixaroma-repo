// inject-content.js (CLEAN RESET ENGINE)
import { getAllSideBarLinks, lastClickedSideBarLink, updateLastClicked, getHrefFromLink } from "../nav/side-bar-nav.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { mainTargetDiv } from "../nav/main-content-nav.js";
import { initStepNavigation } from "../nav/step-nav.js";
import { refreshImages, denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { addCopyCode } from "../ui/copy-code.js";
import { mainContainer } from "../ui/toggle-side-bar.js";
import { initAllVideos } from "../ui/video-controls.js";
export const nxtBtn = document.querySelector('#endNxtBtn');
export const prevBtn = document.querySelector('#prevBtn');
let iAllSideBarLinks = 0;
// =========================
// NEXT / PREV NAV
// =========================
function highlightSidebar() {
    getAllSideBarLinks().forEach(el => {
        el.classList.remove('highlight');
    });
    const current = getAllSideBarLinks()[iAllSideBarLinks];
    if (!current) return;
    current.classList.add('highlight');
    const drop = current.closest('.drop-snips');
    if (drop?.classList.contains('hide')) {
        drop.classList.remove('hide');
    }
}
// =========================
// NEXT BUTTON
// =========================
nxtBtn?.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'a') {
        e.preventDefault();
        e.stopPropagation();
        const steps = document.querySelectorAll('.step-float, .step');
        if (steps.length) {
            steps[steps.length - 1].focus();
        }
        return;
    }
});
nxtBtn?.addEventListener('click', e => {
    e.preventDefault();
    iAllSideBarLinks =
        getAllSideBarLinks().indexOf(lastClickedSideBarLink);
    iAllSideBarLinks =
        (iAllSideBarLinks + 1) % getAllSideBarLinks().length;
    updateLastClicked(getAllSideBarLinks()[iAllSideBarLinks]);
    const href = getHrefFromLink(getAllSideBarLinks()[iAllSideBarLinks]);
    if (href) {
        highlightSidebar();
        injectContent(href);
    }
});
// =========================
// PREV BUTTON
// =========================
prevBtn?.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'a') {
        e.preventDefault();
        e.stopPropagation();
        const steps = document.querySelectorAll('.step-float, .step');
        if (steps.length) {
            steps[steps.length - 1].focus();
        }
        return;
    }
});
prevBtn?.addEventListener('click', e => {
    e.preventDefault();
    iAllSideBarLinks =
        getAllSideBarLinks().indexOf(lastClickedSideBarLink);
    iAllSideBarLinks =
        (iAllSideBarLinks - 1 + getAllSideBarLinks().length)
        % getAllSideBarLinks().length;
    updateLastClicked(getAllSideBarLinks()[iAllSideBarLinks]);
    const href = getHrefFromLink(getAllSideBarLinks()[iAllSideBarLinks]);
    if (href) {
        highlightSidebar();
        injectContent(href);
    }
});
// =========================
// CONTENT LOADER
// =========================


export function injectContent(href) {
    fetch(href)
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.text();
        })
        .then(html => {

            denlargeAllImages();
            mainTargetDiv.innerHTML = html;
            scrollTo(0, 0);

            refreshImages(mainTargetDiv);
            addCopyCode();
            initStepNavigation({ mainTargetDiv });
            initAllVideos(mainTargetDiv);

            // 🔥 NEW: ALWAYS sync tutorial link AFTER DOM exists
            requestAnimationFrame(() => {

                const firstStep = mainTargetDiv.querySelector('.step-float');

                // IMPORTANT ORDER:
                // 1. set base video from sidebar
                if (lastClickedSideBarLink) {
                    changeTutorialLink(lastClickedSideBarLink);
                }

                // 2. override timestamp from first step (if exists)
                if (firstStep) {
                    changeTutorialLink(firstStep);
                }
            });
        })
        .catch(err => {
            console.error('Failed to load content:', err);
        });
}