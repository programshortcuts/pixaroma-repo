// video-controls.js -web-dev-simp-repo
/* =========================
   VIDEO CONTROLS (CLEAN SYSTEM)
========================= */

export function initAllVideos(root = document) {
    const steps = root.querySelectorAll('.step-float');
    steps.forEach(bindVideoControls);
}

function bindVideoControls(step) {
    const stepVid = step.querySelector('.step-vid');
    const vid = step.querySelector('video');

    if (!stepVid || !vid) return;

    // prevent double binding
    if (step.dataset.videoBound === 'true') return;
    step.dataset.videoBound = 'true';

    const playBtn = step.querySelector('.playbtn');
    const fwdBtn = step.querySelector('.fwdBtn');
    const rwdBtn = step.querySelector('.rwdBtn');

    vid.addEventListener('ended', () => {
        resetVideoToPoster(vid);
        syncPlayBtn(playBtn, vid);
    });

    vid.addEventListener('play', () => {
        pauseAllVideos(document, vid);
        syncPlayBtn(playBtn, vid);
    });

    vid.addEventListener('timeupdate', () => {
        ensurePosterAtStart(vid, playBtn);
    });

    vid.addEventListener('seeked', () => {
        ensurePosterAtStart(vid, playBtn);
    });
    /* =========================
       PLAY / PAUSE
    ========================= */
    playBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const wasPlaying = !vid.paused;

        pauseAllVideos(document, vid);

        if (wasPlaying) {
            vid.pause();
            syncPlayBtn(playBtn, vid);
            return;
        }

        vid.play()?.catch(() => {});
        syncPlayBtn(playBtn, vid);
    });
    /* =========================
       FORWARD
    ========================= */
    fwdBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        vid.currentTime = Math.min(
            vid.duration || Infinity,
            vid.currentTime + 5
        );
    });
    /* =========================
       REWIND
    ========================= */
    rwdBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const nextTime = Math.max(0, vid.currentTime - 0.5);
        vid.currentTime = nextTime;

        if (nextTime <= 0.05) {
            resetVideoToPoster(vid);
            syncPlayBtn(playBtn, vid);
        }
    });
    const pauseOtherStepVideos = (e) => {
        if (e.target.closest('.vid-cntrl-btns, .playbtn, .fwdBtn, .rwdBtn')) return;
        pauseAllVideos();
    };

    step.addEventListener('click', pauseOtherStepVideos);
    step.addEventListener('pointerup', pauseOtherStepVideos);
    step.addEventListener('touchend', pauseOtherStepVideos);

    /* =========================
       KEYBOARD CONTROLS (STEP ONLY)
    ========================= */
    step.addEventListener('keydown', (e) => {
        if (e.target.closest('.vid-cntrl-btns, .playbtn, .fwdBtn, .rwdBtn')) return;
        const key = e.key.toLowerCase();
        const isInside = step.contains(document.activeElement);
        if (!isInside) return;

        // SPACE = play/pause
        if (key === ' ') {
            e.preventDefault();
            togglePlay(vid);
            syncPlayBtn(playBtn, vid);
            return;
        }

        // LEFT = back
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            vid.currentTime = Math.max(0, vid.currentTime - 0.5);

            if (vid.currentTime <= 0.05) {
                resetVideoToPoster(vid);
                syncPlayBtn(playBtn, vid);
            }
            return;
        }

        // RIGHT = forward
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            vid.currentTime = Math.min(
                vid.duration || Infinity,
                vid.currentTime + 0.5
            );
            return;
        }
    });
}

/* =========================
   HELPERS
========================= */

function togglePlay(vid) {
    if (vid.paused) vid.play();
    else vid.pause();
}

function syncPlayBtn(btn, vid) {
    if (!btn) return;
    btn.textContent = vid.paused ? '>' : '||';
}

function resetVideoToPoster(vid) {
    if (!vid) return;

    try {
        const wasPlaying = !vid.paused;
        vid.pause();
        vid.currentTime = 0;
        vid.load();
        if (wasPlaying) {
            vid.pause();
        }
    } catch (error) {
        // ignore reset errors
    }
}

function ensurePosterAtStart(vid, btn) {
    if (!vid || vid.dataset.posterResetting === 'true') return;

    if (vid.paused && vid.currentTime <= 0.05 && !vid.ended) {
        vid.dataset.posterResetting = 'true';
        resetVideoToPoster(vid);
        syncPlayBtn(btn, vid);

        setTimeout(() => {
            delete vid.dataset.posterResetting;
        }, 100);
    }
}

/* =========================
   GLOBAL SAFETY PAUSE
========================= */

export function pauseAllVideos(root = document, keepVideo = null) {
    const vids = root.querySelectorAll('video');

    vids.forEach((vid) => {
        if (vid === keepVideo) {
            return;
        }

        resetVideoToPoster(vid);

        const step = vid.closest('.step-float');
        const btn = step?.querySelector('.playbtn');

        syncPlayBtn(btn, vid);
    });
}