// ---- SOUND HELPER ----
function playClickSound() {
    const clickAudio = document.getElementById("sound-click");
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
}

// From main menu → player selection
function goToPlayerScreen() {
    playClickSound();
    const fade = document.getElementById("fade-overlay");
    fade.classList.add("active");

    setTimeout(() => {
        document.getElementById("menu-screen").style.display = "none";
        document.getElementById("player-screen").style.display = "flex";
        fade.classList.remove("active");
    }, 500);
}

// From player selection → specific level
function goToLevel(levelId) {
    playClickSound();
    const fade = document.getElementById("fade-overlay");
    fade.classList.add("active");

    setTimeout(() => {
        document.getElementById("player-screen").style.display = "none";
        document.querySelectorAll(".level-screen").forEach(screen => screen.style.display = "none");

        const target = document.getElementById(levelId);
        if (target) {
            target.style.display = "flex";
        }

        fade.classList.remove("active");
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
    // Level button clicks (A1–C1)
    document.querySelector(".level-1").addEventListener("click", () => goToLevel("level-a1"));
    document.querySelector(".level-2").addEventListener("click", () => goToLevel("level-a2"));
    document.querySelector(".level-3").addEventListener("click", () => goToLevel("level-b1"));
    document.querySelector(".level-4").addEventListener("click", () => goToLevel("level-b2"));
    document.querySelector(".level-5").addEventListener("click", () => goToLevel("level-c1"));

    // Add click sound to level buttons directly (in case you want the click as soon as pressed)
    document.querySelector(".level-1").addEventListener("click", playClickSound);
    document.querySelector(".level-2").addEventListener("click", playClickSound);
    document.querySelector(".level-3").addEventListener("click", playClickSound);
    document.querySelector(".level-4").addEventListener("click", playClickSound);
    document.querySelector(".level-5").addEventListener("click", playClickSound);

    // Folder click: case selection for each level
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", () => {
            const caseNumber = parseInt(folder.dataset.case);
            const level = folder.dataset.level || "a1"; // fallback to a1 if not set
            const fade = document.getElementById("fade-overlay");
            fade.classList.add("active");

            setTimeout(() => {
                document.querySelectorAll(".background").forEach(div => div.style.display = "none");
                loadCase(caseNumber, level); // now includes level info
                fade.classList.remove("active");
            }, 500);
        });
    });

    // Back button logic (returns to level selection or main menu)
    document.querySelectorAll(".back-btn").forEach(btn => {
        btn.addEventListener("click", playClickSound);

        btn.addEventListener("click", () => {
            const fade = document.getElementById("fade-overlay");
            fade.classList.add("active");

            setTimeout(() => {
                const playerScreen = document.getElementById("player-screen");
                const menuScreen = document.getElementById("menu-screen");

                // Check if we are on the level selection screen
                if (playerScreen.style.display === "flex") {
                    // Go back to the main menu
                    playerScreen.style.display = "none";
                    menuScreen.style.display = "flex";
                } else {
                    // We're on a level screen (A1–C1), so go back to level selection
                    document.querySelectorAll(".level-screen").forEach(screen => {
                        if (screen.style.display === "flex") {
                            screen.style.display = "none";
                        }
                    });
                    playerScreen.style.display = "flex";
                }

                fade.classList.remove("active");
            }, 500);
        });
    });
}); // Close DOMContentLoaded
