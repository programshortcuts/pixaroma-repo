import { handleMKey } from "./m-key-handler.js"

import { popupLetterNav } from "../ui/letter-nav-popup.js"
import { initEscapeReset } from "../ui/toggle-img-sizes.js"
import { letterFocus } from "./letter-focus.js"
import { sideBarNav } from "./side-bar-nav.js"
import { mainContentNav } from "./main-content-nav.js"
import { getFocusZone } from "./get-focus-zone.js"
// const popupLetterNav = document.querySelector('#popupLetterNav')
let isLetterNavEnabled = false
export const navState = {
    zone: null,
    isLetterNavEnabled: false
}
export function keyboardNav({e}) {
    navState.zone = getFocusZone({ e })
    if (!navState.zone) return
    let focusZone    
    
    const key = e.key.toLowerCase();
    if (key === 'm') {
        e.preventDefault();
        handleMKey();
        return;
    }    
    // LETTER NAV is WORKING PERFECT, but this is awfule name for code where there is also letterFocus
    if (key == 'x' && e.shiftKey && e.metaKey) {
        isLetterNavEnabled = !isLetterNavEnabled
        popupLetterNav({ e, navState })
        popupLetterNav.innerText = `letter navigation : ${isLetterNavEnabled}`
        popupLetterNav.classList.add('animate')
        document.querySelector('.page-wrapper').classList.toggle('nav-mode-colors')
        setTimeout(() => {
            popupLetterNav.classList.remove('animate')
            console.log('remove')
        }, 1000);

        return
    }
    if (isLetterNavEnabled) {
        letterFocus({ e: e })
        return
    }
    const active = document.activeElement;
    // force header override
    const headerKeys = ['b', 'c', 'd', 'e', 'h', 'p', 'n'];
    if (headerKeys.includes(key)) navState.zone = 'header';
    
    
    // main container override
    
    // if (e.target === mainTargetDiv) {
    //     navState.zone = 'mainTargetDiv';
    //     if (key === 'enter') {
    //         mainTargetDiv.querySelector('.step-float')?.focus();
    //         return;
    //     }
    // }
    focusZone = navState.zone
    switch (focusZone) {
        case 'sideBar':
            sideBarNav({ e, focusZone });
            break;
        case 'mainTargetDiv':
            mainContentNav({ e, focusZone });
            break;
        case 'header':
            letterFocus({ e, focusZone });
            break;
    }

    initEscapeReset()
    // routeKey({ e })
}