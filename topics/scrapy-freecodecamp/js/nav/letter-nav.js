// letter-nav.js
let lastLetterPressed = null
import { mainTargetDiv } from "../nav/main-content-nav.js"
import { getLastStep } from "../nav/step-nav.js"
import { pageWrapper } from "../core/script.js"
export function letterNav({ e }) {
    console.log('here')
    const key = e.key.toLowerCase()
    let target
    if (e.metaKey) return
    console.log('go')
    const allEls = [...document.querySelectorAll('[id],a')].filter(el => {
        if (el.id === 'mainTargetDiv') return true
        return isActuallyVisible(el)
    })
    const firstAlpha = el => {
        // If element is NOT an anchor, use its ID  
        // If anchor has ID, go to ID[0]

        if (el.id) {
            return el.id[0].toLowerCase()
        } else {
            const s = (el.innerText || '').trim().toLowerCase()
            for (let i = 0; i < s.length; i++) {
                if (/[a-z]/.test(s[i])) {
                    return s[i]
                }
            }
            return ''
        }
        // Regular <a> text logic
    }
    const matching = allEls.filter(el => {
        return firstAlpha(el) == key
    })
    const activeEl = document.activeElement
    let iAllEls = allEls.indexOf(activeEl)
    let iMatching = matching.indexOf(activeEl)
    let newIndex

    if (key !== lastLetterPressed) {
        if (iAllEls === -1) {
            // nothing focused: pick first/last
            newIndex = e.shiftKey ? matching.length - 1 : 0
        } else {
            const prevEl = allEls[iAllEls - 1]  // the element directly before
            const nextEl = allEls[iAllEls + 1]  // the element directly after
            // if the previous element matches the letter, go up one
            if (prevEl && matching.includes(prevEl)) {
                newIndex = matching.indexOf(prevEl)
            } else {
                // otherwise go to the next matching element after current focus
                let foundNext = false
                for (let i = iAllEls + 1; i < allEls.length; i++) {
                    if (matching.includes(allEls[i])) {
                        newIndex = matching.indexOf(allEls[i])
                        foundNext = true
                        break
                    }
                }
                if (!foundNext) {
                    // fallback to first matching if nothing found below
                    newIndex = 0
                }
            }
        }
    } else {
        if (iMatching === -1) {
            // currently focused element is not one of the matching elements
            newIndex = e.shiftKey ? matching.length - 1 : 0
        } else {
            newIndex = e.shiftKey
                ? (iMatching - 1 + matching.length) % matching.length
                : (iMatching + 1) % matching.length
        }
    }
    target = matching[newIndex]

    target?.focus()
    if (target === mainTargetDiv) {
        scrollTo(0, 0)
    }
    lastLetterPressed = key

}
export function isActuallyVisible(el) {
    if (!el) return false;
    // 1. Sidebar collapsed → block ALL sidebar descendants
    if (
        pageWrapper?.classList.contains('collapsed') &&
        el.closest('.side-bar')
    ) {
        return false;
    }

    // 2. CSS visibility checks
    const style = getComputedStyle(el);
    if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
    ) {
        return false;
    }

    // 3. Zero-size or clipped
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        return false;
    }

    // 4. Any hidden ancestor (dropdowns, containers, etc.)
    let parent = el.parentElement;
    while (parent) {
        const ps = getComputedStyle(parent);
        if (ps.display === 'none' || ps.visibility === 'hidden') {
            return false;
        }
        parent = parent.parentElement;
    }

    return true;
}