// m-key-handler.js
import { mainTargetDiv } from "./main-content-nav.js";
import { lastStep } from "./step-nav.js";

export function handleMKey() {
    console.log('here')
    const active = document.activeElement;

    const activeStep = active?.closest?.('.step-float');
    if(activeStep){
        // CASE 1
        // child inside step
        if (
            activeStep &&
            active !== activeStep
        ) {
            activeStep.focus();
            return;
        }

        // CASE 2
        // step -> mainTargetDiv
        if (activeStep) {
            mainTargetDiv.focus();
            mainTargetDiv.scrollIntoView({behavior:'smooth',inline:'start'})
            
            return;
        }

        // CASE 3
        // mainTargetDiv -> step
        if (active === mainTargetDiv) {
            if (lastStep) {
                lastStep.focus();
                return;
            }

            mainTargetDiv
                .querySelector('.step-float')
                ?.focus();

            return;
        }

    }
    // CASE 4
    // anywhere else
    if (lastStep) {
        lastStep.focus();
        return;
    } 

    mainTargetDiv
        .querySelector('.step-float')
        ?.focus();
}