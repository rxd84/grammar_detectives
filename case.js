let currentCaseData = [];
let currentQuestion = 0;
let selectedOption = null;
let answered = {};
let currentLevel = "a1";

// ---- FEEDBACK CSV STORAGE ----
let feedbackData = {
    "1": [],
    "2": [],
    "3": []
};

// ---- LOAD FEEDBACK.CSV AUTOMATICALLY ----
function loadFeedbackCSV() {
    fetch('data/feedback.csv')
        .then(response => response.text())
        .then(csv => {
            // Reset arrays
            feedbackData = { "1": [], "2": [], "3": [] };
            const rows = csv.trim().split('\n');
            rows.forEach(row => {
                // Expected format: type,text  (e.g., 1,Keep trying!)
                const [type, ...rest] = row.split(',');
                const text = rest.join(',').trim();
                if (feedbackData[type]) {
                    feedbackData[type].push(text);
                }
            });
        });
}
loadFeedbackCSV();

// ---- MUSIC FADE HELPERS ----
function fadeOutMusic(duration = 2000, cb) {
    const music = document.getElementById("bg-music");
    if (!music) { if (cb) cb(); return; }
    const startVolume = music.volume;
    const step = startVolume / (duration / 50);
    let currentVolume = startVolume;
    const fadeOut = setInterval(() => {
        if (currentVolume > 0.05) {
            currentVolume -= step;
            music.volume = Math.max(currentVolume, 0);
        } else {
            music.volume = 0;
            music.pause();
            clearInterval(fadeOut);
            if (cb) cb();
        }
    }, 50);
}

function fadeInMusic(duration = 2000) {
    const music = document.getElementById("bg-music");
    if (!music) return;
    music.currentTime = 0;
    music.play();
    let currentVolume = 0;
    music.volume = 0;
    const step = 0.4 / (duration / 50); // Target volume is 0.4
    const fadeIn = setInterval(() => {
        if (currentVolume < 0.38) {
            currentVolume += step;
            music.volume = Math.min(currentVolume, 0.4);
        } else {
            music.volume = 0.4;
            clearInterval(fadeIn);
        }
    }, 50);
}

// ---- SOUND HELPERS ----
function playClickSound() {
    const clickAudio = document.getElementById("sound-click");
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
}
function playCorrectSound() {
    const correctAudio = document.getElementById("sound-correct");
    if (correctAudio) {
        correctAudio.currentTime = 0;
        correctAudio.play();
    }
}
function playWrongSound() {
    const wrongAudio = document.getElementById("sound-wrong");
    if (wrongAudio) {
        wrongAudio.currentTime = 0;
        wrongAudio.play();
    }
}

// ---- MUSIC MANAGEMENT ----
function setMainMusic() {
    const music = document.getElementById("bg-music");
    if (music) {
        music.pause();
        music.src = "sounds/grammar_detective_music01.mp3";
        music.loop = true;
        music.currentTime = 0;
        music.load();
        music.volume = 0.4;
        music.muted = false;
        music.play();
    }
}
function setEndingMusic() {
    const music = document.getElementById("bg-music");
    if (music) {
        music.pause();
        music.src = "sounds/ending.mp3";
        music.loop = false;
        music.currentTime = 0;
        music.load();
        music.volume = 0.4;   // Force correct volume
        music.muted = false;   // Make sure not muted
        // Try to play, and if browser blocks, try again after 100ms
        music.play().catch(() => {
            setTimeout(() => {
                music.play().catch(() => {});
            }, 100);
        });
    }
}

// ---- MAIN LOGIC ----
function loadCase(caseNumber, level = "a1") {
    currentLevel = level;
    answered = {};
    fetch(`data/grammar_detective_cases_${level}.csv`)
        .then(response => response.text())
        .then(csv => {
            const rows = csv.trim().split("\n").slice(1); // skip header
            const filtered = rows.map(row => row.split(",")).filter(cells => cells[0] == caseNumber);

            currentCaseData = filtered;
            currentQuestion = 0;
            selectedOption = null;

            showQuestion();
            showCaseScreen();
        });
}

function showCaseScreen() {
    document.querySelectorAll(".background").forEach(div => div.style.display = "none");
    document.getElementById("case-screen").style.display = "flex";

    // Remove any dynamic background from previous score screen usage
    const scoreScreen = document.getElementById("score-screen");
    if (scoreScreen) {
        scoreScreen.style.backgroundImage = "";
    }
    // DO NOT play music here! (music is faded out before entering)
}

function fadeInQuestionSequence() {
    document.getElementById("error-sentence").classList.remove("fade-in");
    document.getElementById("option-1").classList.remove("fade-in");
    document.getElementById("option-2").classList.remove("fade-in");
    document.getElementById("option-3").classList.remove("fade-in");
    document.getElementById("option-4").classList.remove("fade-in");

    document.getElementById("error-sentence").style.opacity = 0;
    document.getElementById("option-1").style.opacity = 0;
    document.getElementById("option-2").style.opacity = 0;
    document.getElementById("option-3").style.opacity = 0;
    document.getElementById("option-4").style.opacity = 0;

    setTimeout(() => {
        document.getElementById("error-sentence").classList.add("fade-in");
        document.getElementById("error-sentence").style.opacity = 1;
        setTimeout(() => {
            document.getElementById("option-1").classList.add("fade-in");
            document.getElementById("option-1").style.opacity = 1;
            setTimeout(() => {
                document.getElementById("option-2").classList.add("fade-in");
                document.getElementById("option-2").style.opacity = 1;
                setTimeout(() => {
                    document.getElementById("option-3").classList.add("fade-in");
                    document.getElementById("option-3").style.opacity = 1;
                    setTimeout(() => {
                        document.getElementById("option-4").classList.add("fade-in");
                        document.getElementById("option-4").style.opacity = 1;
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 100);
}

function showQuestion() {
    const q = currentCaseData[currentQuestion];
    if (!q) return;

    const [_, error, correct, opt1, opt2, opt3, opt4] = q;

    document.getElementById("error-sentence").classList.remove("fade-in");
    document.getElementById("option-1").classList.remove("fade-in");
    document.getElementById("option-2").classList.remove("fade-in");
    document.getElementById("option-3").classList.remove("fade-in");
    document.getElementById("option-4").classList.remove("fade-in");
    document.getElementById("correct-sentence").classList.remove("fade-in");
    document.getElementById("correct-sentence").style.opacity = 0;
    document.getElementById("correct-sentence").style.display = "none";

    document.getElementById("error-sentence").textContent = error;
    document.getElementById("option-1").textContent = opt1;
    document.getElementById("option-2").textContent = opt2;
    document.getElementById("option-3").textContent = opt3;
    document.getElementById("option-4").textContent = opt4;

    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.remove("disabled");
        btn.classList.remove("selected");
    });

    if (answered[currentQuestion]) {
        const saved = answered[currentQuestion];
        selectedOption = saved.selected;

        document.querySelectorAll(".option-btn").forEach(el => {
            if (parseInt(el.dataset.option) === selectedOption) {
                el.classList.add("selected");
            }
        });

        document.getElementById("correct-sentence").textContent = currentCaseData[currentQuestion][2];
        document.getElementById("correct-sentence").style.display = "block";
        setTimeout(() => {
            document.getElementById("correct-sentence").classList.add("fade-in");
            document.getElementById("correct-sentence").style.opacity = 1;
        }, 100);

        document.querySelectorAll(".option-btn").forEach(btn => btn.classList.add("disabled"));

        document.getElementById("solve-btn").classList.remove("enabled");
        document.getElementById("next-btn").classList.add("enabled");

        const correctAnswer = parseInt(currentCaseData[currentQuestion][7]);
        if (selectedOption === correctAnswer) {
            document.getElementById("feedback-image").src = `images/${currentLevel}_correct.png`;
        } else {
            document.getElementById("feedback-image").src = `images/${currentLevel}_wrong.png`;
        }
        return;
    }

    selectedOption = null;
    updateSolveState();

    document.getElementById("feedback-image").src = `images/${currentLevel}_neutral.png`;

    fadeInQuestionSequence();
}

function updateSolveState() {
    const btn = document.getElementById("solve-btn");
    if (selectedOption !== null) {
        btn.classList.add("enabled");
    } else {
        btn.classList.remove("enabled");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // --- FOLDER (CASE) SELECTION LOGIC WITH MUSIC FADE OUT ---
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", () => {
            const caseNumber = parseInt(folder.dataset.case);
            const level = folder.dataset.level || "a1";
            const fade = document.getElementById("fade-overlay");
            fade.classList.add("active");

            // Fade out music, then load case screen
            fadeOutMusic(2000, function () {
                document.querySelectorAll(".background").forEach(div => div.style.display = "none");
                loadCase(caseNumber, level);
                fade.classList.remove("active");
            });
        });
    });

    // Level button clicks (sound on click) and hover (sound on hover)
    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.addEventListener("click", playClickSound);
        btn.addEventListener("mouseenter", () => {
            const clickAudio = document.getElementById("sound-click");
            if (clickAudio) {
                clickAudio.currentTime = 0;
                clickAudio.play();
            }
        });
    });

    // CASE SCREEN BUTTONS
    document.querySelectorAll(".option-btn").forEach(el => {
        el.addEventListener("click", () => {
            selectedOption = parseInt(el.dataset.option);
            document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
            el.classList.add("selected");
            updateSolveState();
        });
    });

    document.getElementById("solve-btn").addEventListener("click", () => {
        if (selectedOption === null) return;

        playClickSound();

        const solveBtn = document.getElementById("solve-btn");
        solveBtn.classList.remove("enabled");

        document.getElementById("next-btn").classList.add("enabled");

        document.getElementById("correct-sentence").textContent = currentCaseData[currentQuestion][2];
        document.getElementById("correct-sentence").style.display = "block";
        setTimeout(() => {
            document.getElementById("correct-sentence").classList.add("fade-in");
            document.getElementById("correct-sentence").style.opacity = 1;
        }, 100);

        answered[currentQuestion] = {
            selected: selectedOption,
            solved: true,
            correct: parseInt(currentCaseData[currentQuestion][7])
        };

        const correctAnswer = parseInt(currentCaseData[currentQuestion][7]);
        if (selectedOption === correctAnswer) {
            playCorrectSound();
            document.getElementById("feedback-image").src = `images/${currentLevel}_correct.png`;
        } else {
            playWrongSound();
            document.getElementById("feedback-image").src = `images/${currentLevel}_wrong.png`;
        }

        document.querySelectorAll(".option-btn").forEach(btn => {
            btn.classList.add("disabled");
        });
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        playClickSound();

        if (currentQuestion < currentCaseData.length - 1) {
            currentQuestion++;
            selectedOption = null;
            showQuestion();

            document.getElementById("solve-btn").classList.remove("enabled");
            document.getElementById("next-btn").classList.remove("enabled");
            document.getElementById("correct-sentence").style.display = "none";
        } else {
            // End of case — show score
            const total = currentCaseData.length;
            let correctCount = 0;
            for (let i in answered) {
                if (answered[i].selected === answered[i].correct) {
                    correctCount++;
                }
            }
            showScoreScreenWithFeedback(correctCount, total);
        }
    });

    // --- BACK BUTTON (CASE SCREEN) WITH MUSIC FADE IN ---
    document.querySelectorAll(".back-btn").forEach(btn => {
        btn.addEventListener("click", playClickSound);

        btn.addEventListener("click", () => {
            if (document.getElementById("case-screen").style.display === "flex") {
                const fade = document.getElementById("fade-overlay");
                fade.classList.add("active");

                setTimeout(() => {
                    document.querySelectorAll(".background").forEach(div => {
                        div.style.display = "none";
                    });
                    document.getElementById(`level-${currentLevel}`).style.display = "flex";
                    fade.classList.remove("active");

                    // Fade music back in when returning to case selection
                    fadeInMusic(2000);
                }, 500);
            }
        });
    });
}); // Close DOMContentLoaded

function showScoreScreenWithFeedback(correctCount, total) {
    const fade = document.getElementById("fade-overlay");
    fade.classList.add("active");

    setTimeout(() => {
        document.querySelectorAll(".background").forEach(div => div.style.display = "none");
        const scoreScreen = document.getElementById("score-screen");
        scoreScreen.style.display = "flex";

        // Reset all elements
        const scoreDisplay = document.getElementById("final-score");
        scoreDisplay.style.display = "none";
        scoreDisplay.style.opacity = 0;

        // Hide feedback image and dialogue box initially
        let closedCasesImg = document.getElementById("closed-cases-img");
        let dialogueBoxImg = document.getElementById("dialogue-box-img");
        let feedbackTextbox = document.getElementById("feedback-textbox");
        if (closedCasesImg) {
            closedCasesImg.style.display = "none";
            closedCasesImg.style.opacity = 0;
        }
        if (dialogueBoxImg) {
            dialogueBoxImg.style.display = "none";
            dialogueBoxImg.style.opacity = 0;
        }
        if (feedbackTextbox) {
            feedbackTextbox.style.display = "none";
            feedbackTextbox.style.opacity = 0;
        }

        // *** DO NOT REMOVE: Plays ending.mp3 on score screen ***
        setEndingMusic();

        // Set dynamic background based on score
        let percentage = (total === 0) ? 0 : (correctCount / total) * 100;
        let resultImage = "low_average_scene.png";
        if (percentage > 65) {
            resultImage = "high_scene.png";
        }
        if (scoreScreen) {
            scoreScreen.style.backgroundImage = `url('images/${resultImage}')`;
            scoreScreen.style.backgroundSize = "cover";
            scoreScreen.style.backgroundPosition = "center";
        }

        setTimeout(() => {
            // 1. Show closed_cases.png and score (fade in 1s)
            if (closedCasesImg) {
                closedCasesImg.style.display = "block";
                closedCasesImg.style.transition = "opacity 1s";
                setTimeout(() => { closedCasesImg.style.opacity = 1; }, 10);
            }
            scoreDisplay.textContent = `${correctCount}`;
            scoreDisplay.style.display = "block";
            scoreDisplay.style.transition = "opacity 1s";
            setTimeout(() => { scoreDisplay.style.opacity = 1; }, 10);

            setTimeout(() => {
                if (dialogueBoxImg) {
                    dialogueBoxImg.style.display = "block";
                    dialogueBoxImg.style.transition = "opacity 1s";
                    setTimeout(() => { dialogueBoxImg.style.opacity = 1; }, 10);
                }
                if (feedbackTextbox) {
                    feedbackTextbox.style.display = "block";
                    feedbackTextbox.style.transition = "opacity 1s";
                    setTimeout(() => { feedbackTextbox.style.opacity = 1; }, 10);
                }

                let feedbackType = "1";
                if (correctCount >= 8) feedbackType = "3";
                else if (correctCount >= 4) feedbackType = "2";
                let feedbackArr = feedbackData[feedbackType] || [];
                let feedbackText = "Good job!";
                if (feedbackArr && feedbackArr.length > 0) {
                    feedbackText = feedbackArr[Math.floor(Math.random() * feedbackArr.length)];
                }
                if (feedbackTextbox) {
                    feedbackTextbox.textContent = feedbackText;
                }

            }, 2000);

        }, 1000);

        fade.classList.remove("active");
    }, 500);
}

// === Solve/Next Overlay Logic ===
let optionChecked = false;
let solveClicked = false;

const solveBtnDiv = document.getElementById('solve-btn');
const nextBtnDiv = document.getElementById('next-btn');
const solveOverlay = solveBtnDiv ? solveBtnDiv.querySelector('.button-overlay') : null;
const nextOverlay = nextBtnDiv ? nextBtnDiv.querySelector('.button-overlay') : null;

document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        optionChecked = true;
    });
});

if (solveBtnDiv) {
    solveBtnDiv.addEventListener('click', function() {
        if (optionChecked) {
            solveClicked = true;
        }
    });

    solveBtnDiv.addEventListener('mouseenter', function() {
        if (optionChecked) {
            solveBtnDiv.classList.remove('hovering');
            solveBtnDiv.classList.add('fully-visible');
        } else {
            solveBtnDiv.classList.add('hovering');
            solveBtnDiv.classList.remove('fully-visible');
        }
    });
    solveBtnDiv.addEventListener('mouseleave', function() {
        solveBtnDiv.classList.remove('hovering');
        solveBtnDiv.classList.remove('fully-visible');
    });
}

if (nextBtnDiv) {
    nextBtnDiv.addEventListener('mouseenter', function() {
        if (solveClicked) {
            nextBtnDiv.classList.remove('hovering');
            nextBtnDiv.classList.add('fully-visible');
        } else {
            nextBtnDiv.classList.add('hovering');
            nextBtnDiv.classList.remove('fully-visible');
        }
    });
    nextBtnDiv.addEventListener('mouseleave', function() {
        nextBtnDiv.classList.remove('hovering');
        nextBtnDiv.classList.remove('fully-visible');
    });
}

function resetSolveNextOverlayState() {
    optionChecked = false;
    solveClicked = false;
    if (solveBtnDiv) solveBtnDiv.classList.remove('hovering', 'fully-visible');
    if (nextBtnDiv) nextBtnDiv.classList.remove('hovering', 'fully-visible');
}
