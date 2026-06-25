// m-key-handler.js
import { lastStep } from "./step-nav.js";
import { mainTargetDiv } from "./main-content-nav.js";

export function handleMKey({ e, focusZone }) {
    e.preventDefault();
    e.stopPropagation();

    const active = document.activeElement;

    if (focusZone !== 'mainTargetDiv') {
        if (lastStep && document.contains(lastStep)) {
            lastStep.focus();
        } else if (mainTargetDiv && document.contains(mainTargetDiv)) {
            mainTargetDiv.focus();
        }
        return;
    }

    if (active?.closest('.step-float')) {
        mainTargetDiv?.focus();
        return;
    }

    if (active === mainTargetDiv || active?.closest('#mainTargetDiv')) {
        if (lastStep && document.contains(lastStep)) {
            lastStep.focus();
        }
        return;
    }

    if (lastStep && document.contains(lastStep)) {
        lastStep.focus();
        return;
    }

    // mainTargetDiv?.focus();
}
