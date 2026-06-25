// drop-downs-sidebar-temp.js
import { mainTargetDiv } from "../nav/main-content-nav.js";
export function initDropDowns() {
    document.addEventListener("click", handleToggle);
    document.addEventListener("keydown", handleToggle);
    hideTopicSnips()
    function handleToggle(e) {
        let link;
        
        
        // console.log(typeof(e.key.toLowerCase()))
        // --- Handle keyboard activation ---
        if (e.type === "keydown") {
            const key = e.key.toLowerCase()
            
            const dropdown =
                e.target.classList.contains("drop-down")
                    ? e.target
                    : null;

            if (
                dropdown &&
                (e.key === "Enter" || e.key === " ")
            ) {

                e.preventDefault();

                link = dropdown;

            } else {
                return;
            }
        }

        // --- Handle mouse click activation ---
        if (e.type === "click") {
            const clicked = e.target.closest(".drop-down");
            if (!clicked) return; // ignore clicks not on .drop-down links
            e.preventDefault();
            link = clicked;
        }

        if (!link) return;

        // Find the <li> containing this .drop-down link
        const parentLi = link.closest("li");
        if (!parentLi) return;

        // Find the nested .drop-snips *inside that li only*
        const nestedList = parentLi.querySelector(":scope > .drop-snips");
        if (!nestedList) return;

        // Toggle visibility
        nestedList.classList.toggle("hide");
    }
}

export function hideTopicSnips() {
    document.querySelectorAll(".side-bar-links > li .drop-snips").forEach(el => {
        if (!el.classList.contains("show") ) {
            el.classList.add("hide");
        }
    });
}
