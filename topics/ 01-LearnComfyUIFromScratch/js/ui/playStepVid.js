// playStepVid.js

// =========================
// PAUSE ALL VIDEOS
// =========================

export function pauseAllVideos({ allVids = [] } = {}) {

    if (!Array.isArray(allVids)) return;

    allVids.forEach(vid => {

        if (!(vid instanceof HTMLVideoElement)) return;

        vid.pause();
    });
}

// =========================
// MAIN CONTROLLER
// =========================

export function videoControls({ vid, e } = {}) {

    if (!vid || !(vid instanceof HTMLVideoElement)) return;

    const key = e?.key?.toLowerCase?.();

    const isClick = e?.type === 'click';
    const isKeydown = e?.type === 'keydown';

    // Normalize behavior: same action source (click OR enter/space)
    if (isClick) {

        togglePlay(vid);
        return;
    }

    if (!isKeydown) return;

    // =========================
    // ENTER → play/pause
    // =========================
    if (key === 'enter') {

        e.preventDefault();
        togglePlay(vid);
        return;
    }

    // =========================
    // SPACE → play/pause
    // =========================
    if (key === ' ') {

        e.preventDefault();
        togglePlay(vid);
        return;
    }

    // =========================
    // LEFT / RIGHT SEEK
    // =========================
    if (key === 'arrowleft') {

        seek(vid, -0.5);
        return;
    }

    if (key === 'arrowright') {

        seek(vid, 0.5);
        return;
    }
}

// =========================
// TOGGLE PLAY
// =========================

function togglePlay(vid) {

    if (vid.paused) {
        vid.play();
    } else {
        vid.pause();
    }
}

// =========================
// SEEK
// =========================

function seek(vid, amount) {

    const next = vid.currentTime + amount;

    vid.currentTime = Math.max(0, next);
}