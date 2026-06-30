// drop-downs-sidebar-temp.js
import { mainTargetDiv } from "../nav/main-content-nav.js";
export function initDropDowns() {
    document.addEventListener("click", handleToggle);
    document.addEventListener("keydown", handleToggle);
    hideTopicSnips()
    function handleToggle(e) {
        let link = null;

        if (e.type === "click") {
            link = e.target.closest(".drop-down");
        }

        if (
            e.type === "keydown" &&
            (e.key === "Enter" || e.key === " ")
        ) {
            link = e.target.closest(".drop-down");
        }

        if (!link) return;

        e.preventDefault();

        const nestedList = link
            .closest("li")
            ?.querySelector(":scope > .drop-snips");

        if (!nestedList) return;

        const wasHidden = nestedList.classList.contains("hide");

        hideTopicSnips();

        if (wasHidden) {
            nestedList.classList.remove("hide");
        } else {
            nestedList.classList.add("hide");
        }
    }
}

export function hideTopicSnips() {
    document.querySelectorAll(".side-bar-links > li .drop-snips").forEach(el => {
        if (!el.classList.contains("show") ) {
            el.classList.remove("show")
            el.classList.add("hide");
        }
    });
}
