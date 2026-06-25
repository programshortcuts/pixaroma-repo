
export const sideBar = document.querySelector('.side-bar');
export const sideBarBtn = document.querySelector('#sideBarBtn');
export const navBarLessonTitle = document.querySelector('.nav-bar-lesson-title');
export const mainContainer = document.querySelector('.main-container');

// =========================
// INIT SIDEBAR
// =========================
export function initToggleSidebar() {

    if (!sideBar || !sideBarBtn || !navBarLessonTitle || !mainContainer) return;

    // toggle from button click
    sideBarBtn.addEventListener('click', toggleSidebar);

    navBarLessonTitle.addEventListener('click', toggleSidebar);

    // keyboard support
    sideBarBtn.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'enter') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    navBarLessonTitle.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'enter') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // click outside sidebar to close
    sideBar.addEventListener('click', (e) => {
        if (e.target === sideBar) {
            mainContainer.classList.add('collapsed');
        }
    });
}

// =========================
// CORE TOGGLE
// =========================
function toggleSidebar() {
    mainContainer.classList.toggle('collapsed');
}