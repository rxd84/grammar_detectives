// ---- SOUND HELPER ----
function playClickSound() {
    const clickAudio = document.getElementById("sound-click");
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const fadeOverlay = document.getElementById("fade-overlay");
    const introScreen1 = document.getElementById("intro-screen-1");
    const introScreen2 = document.getElementById("intro-screen-2");
    const menuScreen = document.getElementById("menu-screen");
    const bgMusic = document.getElementById("bg-music");
    const soundOnBtn = document.getElementById("intro-sound-on");
    const soundOffBtn = document.getElementById("intro-sound-off");
    const soundToggleBtns = document.querySelectorAll("#sound-toggle");

    // Start: show intro-screen-2, hide intro-screen-1 and menu
    introScreen2.style.display = "flex";
    introScreen1.style.display = "none";
    menuScreen.style.display = "none";

    // Fade in on page load
    fadeOverlay.classList.add("active");
    setTimeout(() => {
        fadeOverlay.classList.remove("active");
    }, 500);

    // Helper to fade transition between screens with extra delay
    function fadeToScreen(hideScreen, showScreen, afterFade = null) {
        fadeOverlay.classList.add("active");
        setTimeout(() => {
            hideScreen.style.display = "none";
            // Wait 0.5s before showing the next screen for the effect you want
            setTimeout(() => {
                showScreen.style.display = "flex";
                fadeOverlay.classList.remove("active");
                if (afterFade) afterFade();
            }, 500);
        }, 500); // Keep the fade black effect timing
    }

    // Handler after user chooses sound ON/OFF
    function proceedAfterSound(selectedSoundOn) {
        if (selectedSoundOn) {
            setTimeout(() => {
                bgMusic.currentTime = 0;
		bgMusic.volume = 0.4; // or whatever final volume you want
		bgMusic.play();
	
                // Update menu icon if you use one
                soundToggleBtns.forEach(btn => btn.src = "images/sound_on.png");
            }, 1000); // 1 second delay before starting music
        } else {
            bgMusic.pause();
            soundToggleBtns.forEach(btn => btn.src = "images/sound_off.png");
        }

        // Transition: fade to intro-screen-1, then to menu after 3s
        fadeToScreen(introScreen2, introScreen1, function () {
            setTimeout(() => {
                fadeToScreen(introScreen1, menuScreen);
            }, 3000);
        });
    }

    // Sound ON/OFF button logic with click sound
    soundOnBtn.addEventListener("click", () => {
        playClickSound();
        proceedAfterSound(true);
    });
    soundOffBtn.addEventListener("click", () => {
        playClickSound();
        proceedAfterSound(false);
    });
});
