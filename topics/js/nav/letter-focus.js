 // letter-focus.js
let lastLetterPressed = null;
import { handleMKey } from "./m-key-handler.js";
import { mainTargetDiv } from "./main-content-nav.js";
import { lastClickedSideBarLink } from "./side-bar-nav.js";
import { mainContainer, sideBarBtn } from "../ui/toggle-side-bar.js";
import { navBarLessonTitle } from "../ui/toggle-side-bar.js";
export function letterFocus({ e, focusZone }) {
    if (!e || !e.key) return;    
    // Ignore typing fields and modifier keys
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key.length !== 1 || !/^[a-z0-9]$/.test(key)) return;
    // Find visible, valid elements
    const allEls = [...document.querySelectorAll('a, [id]')].filter(el => {
        const rect = el.getBoundingClientRect();
        return el.offsetParent !== null && rect.width > 0 && rect.height > 0;
    });
    // Filter elements by ID starting with pressed key
    const matching = allEls.filter(el => {
        const id = el.id?.toLowerCase?.() || '';
        return (
            id.startsWith(key) &&
            id !== 'targetdiv' &&
            id !== 'targetheaderh3'
        );
    });
    if (matching.length === 0) return;
    const activeEl = document.activeElement;
    const activeIndex = matching.indexOf(activeEl);
    let newIndex;
    if (key !== lastLetterPressed) {
        newIndex = e.shiftKey ? matching.length - 1 : 0;
    } else {
        if (activeIndex === -1) {
            newIndex = e.shiftKey ? matching.length - 1 : 0;
        } else {
            newIndex = e.shiftKey
                ? (activeIndex - 1 + matching.length) % matching.length
                : (activeIndex + 1) % matching.length;
        }
    }
    const target = matching[newIndex];
    if (!target) return;
    // Ensure focusability
    if (typeof target.focus !== 'function') {
        target.setAttribute('tabindex', '-1');
    }
    target.focus();
    lastLetterPressed = key;
}
