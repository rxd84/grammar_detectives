// ---- SOUND HELPER ----
function playClickSound() {
    const clickAudio = document.getElementById("sound-click");
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
}

// MUSIC TOGGLE HANDLING (used everywhere except the intro screen)
function toggleSound() {
    playClickSound();
    const music = document.getElementById("bg-music");
    const toggles = document.querySelectorAll(".sound-toggle");

    if (music.paused || music.muted || music.volume === 0) {
        music.muted = false;
        music.volume = 0.5;
        music.play();
        toggles.forEach(t => t.src = "images/sound_on.png");
    } else {
        music.muted = true;
        music.pause();
        toggles.forEach(t => t.src = "images/sound_off.png");
    }
}

// Fade and go to main menu
function goToMainMenu() {
    const fade = document.getElementById("fade-overlay");
    fade.classList.add("active");
    setTimeout(function () {
        document.querySelectorAll(".background").forEach(div => div.style.display = "none");
        document.getElementById("menu-screen").style.display = "flex";

        // Always switch to menu music when returning home
        if (typeof setMainMusic === "function") {
            setMainMusic();
        }

        // Only update sound toggles that actually exist (menu and beyond)
        const soundToggles = document.querySelectorAll(".sound-toggle");
        const music = document.getElementById("bg-music");
        if (music.paused || music.muted || music.volume === 0) {
            soundToggles.forEach(t => t.src = "images/sound_off.png");
        } else {
            soundToggles.forEach(t => t.src = "images/sound_on.png");
        }

        if (typeof attachSoundToggleListeners === "function") attachSoundToggleListeners();
        fade.classList.remove("active");
    }, 400);
}

// Attach toggles to all sound icons (menu and later screens)
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bg-music");
    const toggles = document.querySelectorAll(".sound-toggle");

    if (toggles.length > 0) {
        // Set correct icon on load
        if (music.paused || music.muted || music.volume === 0) {
            toggles.forEach(t => t.src = "images/sound_off.png");
        } else {
            toggles.forEach(t => t.src = "images/sound_on.png");
        }
        toggles.forEach(toggle => {
            toggle.addEventListener("click", function() {
                playClickSound();
                if (music.paused || music.muted || music.volume === 0) {
                    music.muted = false;
                    music.volume = 0.5;
                    music.play();
                    toggles.forEach(t => t.src = "images/sound_on.png");
                } else {
                    music.muted = true;
                    music.pause();
                    toggles.forEach(t => t.src = "images/sound_off.png");
                }
            });
        });
    }
});
