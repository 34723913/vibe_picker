// --- script.js ---
console.log("--- script.js SCRIPT STARTED (Top of file) ---");

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- DOMContentLoaded event fired ---");

    const welcomeContainer = document.getElementById('welcome-container');
    const nicknameInput = document.getElementById('nickname-input');
    const startQuizButton = document.getElementById('start-quiz-button');
    const userGreetingElement = document.getElementById('user-greeting');

    const quizContainer = document.getElementById('quiz-container');
    const questionArea = document.getElementById('question-area');
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    const resultContainer = document.getElementById('result-container');
    const resultTitleElement = document.getElementById('result-title');
    const finalVibeTextElement = document.getElementById('final-vibe-text');
    const youtubePlayerWrapper = document.getElementById('youtube-player-wrapper');
    const restartButton = document.getElementById('restart-button');

    const typewriterElement = document.getElementById('typewriter-title');

    if (!welcomeContainer) console.error("CRITICAL ERROR: 'welcome-container' NOT FOUND!");
    // ... (其他元素檢查) ...
    if (!youtubePlayerWrapper) console.error("CRITICAL ERROR: 'youtube-player-wrapper' NOT FOUND!");
    if (!typewriterElement) console.warn("Warning: 'typewriter-title' element NOT FOUND, typewriter effect will not run.");

    let userNickname = "朋友";
    const questions = [
        { question: "，今天早上醒來，你的第一感覺是？", options: [ { text: "陽光明媚，充滿幹勁！", scores: { "開心": 10, "激昂": 5 } }, { text: "有點疲倦，但還行。", scores: { "憂鬱": 3, "神秘": 2 } }, { text: "平靜，準備好迎接挑戰。", scores: { "開心": 5, "神秘": 5 } }, { text: "不想起床，世界與我無關。", scores: { "憂鬱": 10 } } ] },
        { question: "，如果現在有一段空閒時間，你會選擇做什麼？", options: [ { text: "聽節奏感強的音樂，動起來！", scores: { "激昂": 10, "開心": 5 } }, { text: "泡杯茶，看窗外發呆。", scores: { "憂鬱": 5, "神秘": 5 } }, { text: "探索新事物，例如看一部懸疑片。", scores: { "神秘": 10, "激昂": 3 } }, { text: "和朋友聊天，分享快樂。", scores: { "開心": 10 } } ] },
        { question: "，你偏愛哪種類型的電影或故事？", options: [ { text: "充滿熱血與冒險的動作片。", scores: { "激昂": 10 } }, { text: "溫馨感人的劇情片。", scores: { "開心": 7, "憂鬱": 3 } }, { text: "引人深思的哲學或科幻故事。", scores: { "神秘": 10, "憂鬱": 2 } }, { text: "輕鬆幽默的喜劇。", scores: { "開心": 10 } } ] },
        { question: "，你對「未知」的感覺是？", options: [ { text: "充滿好奇，躍躍欲試！", scores: { "激昂": 7, "神秘": 7 } }, { text: "有點不安，但可以接受。", scores: { "憂鬱": 5, "開心": 3 } }, { text: "無感，順其自然。", scores: { "神秘": 3, "開心": 3 } }, { text: "盡量避免，喜歡確定的事物。", scores: { "憂鬱": 7 } } ] }
    ];

    const vibePlaylists = {
        "開心": "PLiK9lUE0b6aE3ApItsY_Hj-VIigT3Nsw3",
        "憂鬱": "PLokZVyVj5Ncr5jy0emi-v-MCRDK-2KSRw",
        "激昂": "PLPEnC3mtptkuub_yFxlEXMPcrfRof6Tis",
        "神秘": "PLJozx4nEjLPHWukhjqt1n02lA6Od88pvx"
    };
    // !!! 請確保這些數字是你播放清單的【實際影片數量上限】 !!!
    const vibePlaylistCounts = {
        "開心": 23, // 範例，請替換成實際數量
        "憂鬱": 15, // 範例
        "激昂": 40, // 範例
        "神秘": 18  // 範例
    };

    let currentQuestionIndex = 0;
    let scores = { "開心": 0, "憂鬱": 0, "激昂": 0, "神秘": 0 };

    const typewriterSentences = [
        "正在為你搜尋今日的專屬旋律... 🎶", "你的靈魂，適合什麼樣的聲音？ 🤔", "放輕鬆，我們即將打開一扇通往聲音的門。🚪✨", "今天的你，會是哪種頻率共振？ 🔊", "嘿！來看看今天你是什麼歌！ 🎧", "別滑了，這裡有一首屬於你的歌等著你！ ➡️🎵", "用一首歌，說說今天的你。🎤", "你的今日主題曲即將出現... 🎬", "來吧，挑戰看看你會是哪首歌的主角？ 🌟"
    ];
    let sentenceTypeIndex = 0;
    let charDisplayIndex = 0;
    let isDeletingText = false;
    const typingSpeedMs = 130;
    const erasingSpeedMs = 70;
    const delayBeforeEraseMs = 2000;
    const delayBeforeNextMs = 500;
    let typewriterTimeoutId = null;

    function typeWriterEffect() {
        if (!typewriterElement || !welcomeContainer || welcomeContainer.style.display === 'none') {
            if (typewriterTimeoutId) clearTimeout(typewriterTimeoutId);
            return;
        }
        const currentSentenceToType = typewriterSentences[sentenceTypeIndex];
        if (isDeletingText) {
            typewriterElement.textContent = currentSentenceToType.substring(0, charDisplayIndex - 1);
            charDisplayIndex--;
            if (charDisplayIndex === 0) {
                isDeletingText = false;
                sentenceTypeIndex = (sentenceTypeIndex + 1) % typewriterSentences.length;
                typewriterTimeoutId = setTimeout(typeWriterEffect, delayBeforeNextMs);
            } else {
                typewriterTimeoutId = setTimeout(typeWriterEffect, erasingSpeedMs);
            }
        } else {
            typewriterElement.textContent = currentSentenceToType.substring(0, charDisplayIndex + 1);
            charDisplayIndex++;
            if (charDisplayIndex === currentSentenceToType.length) {
                isDeletingText = true;
                typewriterTimeoutId = setTimeout(typeWriterEffect, delayBeforeEraseMs);
            } else {
                typewriterTimeoutId = setTimeout(typeWriterEffect, typingSpeedMs);
            }
        }
    }

    function startTypewriter() {
        if (typewriterElement && welcomeContainer && welcomeContainer.style.display !== 'none') {
            if (typewriterTimeoutId) clearTimeout(typewriterTimeoutId);
            typewriterElement.textContent = '';
            sentenceTypeIndex = 0;
            charDisplayIndex = 0;
            isDeletingText = false;
            console.log("Starting typewriter effect...");
            typewriterTimeoutId = setTimeout(typeWriterEffect, delayBeforeNextMs);
        }
    }

    function switchScreen(hideElement, showElement, callbackAfterShow) {
        const animationDuration = 600;
        if (hideElement) {
            hideElement.classList.remove('do-fade-in');
            hideElement.classList.add('do-fade-out');
            setTimeout(() => {
                hideElement.style.display = 'none';
                hideElement.classList.remove('do-fade-out');
                if (hideElement === welcomeContainer && typewriterTimeoutId) {
                    clearTimeout(typewriterTimeoutId);
                    console.log("Welcome screen hidden, typewriter stopped.");
                }
                if (showElement) proceedWithShow();
            }, animationDuration - 100);
        } else if (showElement) {
            proceedWithShow();
        }

        function proceedWithShow() {
            showElement.classList.remove('hidden', 'do-fade-out');
            showElement.style.display = 'block';
            showElement.classList.add('do-fade-in');
            if (showElement === welcomeContainer) {
                startTypewriter();
            }
            if (callbackAfterShow) {
                setTimeout(callbackAfterShow, animationDuration);
            }
        }
    }

    startQuizButton?.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            nicknameInput.classList.add('input-error-shake');
            setTimeout(() => nicknameInput.classList.remove('input-error-shake'), 500);
            return;
        }
        userNickname = nickname;
        localStorage.setItem('vibeNickname', userNickname);
        if(userGreetingElement) userGreetingElement.textContent = `嗨，${userNickname}！`;
        switchScreen(welcomeContainer, quizContainer, loadQuestion);
    });

    restartButton?.addEventListener('click', resetQuiz);

    function loadQuestion() {
        if (quizContainer && quizContainer.style.display === 'none') {
             quizContainer.classList.remove('hidden');
             quizContainer.style.display = 'block';
        }
        if (currentQuestionIndex < questions.length) {
            const q = questions[currentQuestionIndex];
            if(questionTextElement) questionTextElement.textContent = userNickname + q.question;
            if(optionsContainer) optionsContainer.innerHTML = '';
            if (questionArea) {
                questionArea.classList.remove('hidden', 'do-fade-out');
                void questionArea.offsetWidth;
                questionArea.classList.add('do-fade-in');
            }
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.textContent = opt.text;
                btn.className = 'option-button';
                btn.addEventListener('click', () => selectOption(opt, btn));
                optionsContainer.appendChild(btn);
            });
        } else {
            switchScreen(quizContainer, resultContainer, displayResultsContent);
        }
    }

    function selectOption(optionData, buttonElement) {
        buttonElement.classList.add('disappearing');
        const btns = optionsContainer.querySelectorAll('.option-button');
        btns.forEach(btn => {
            if (btn !== buttonElement) btn.classList.add('disappearing-fast');
            btn.disabled = true;
        });
        for (const vibe in optionData.scores) {
            if(scores.hasOwnProperty(vibe)) {
                scores[vibe] += optionData.scores[vibe];
            }
        }
        setTimeout(() => {
            currentQuestionIndex++;
            if (questionArea) {
                questionArea.classList.remove('do-fade-in');
                questionArea.classList.add('do-fade-out');
                const questionAreaAnimationDuration = 500;
                setTimeout(() => {
                    questionArea.classList.remove('do-fade-out');
                    loadQuestion();
                }, questionAreaAnimationDuration);
            } else {
                loadQuestion();
            }
        }, 700);
    }

    function displayResultsContent() {
        console.log("Executing displayResultsContent() to embed YouTube iframe.");
        let maxScore = -Infinity, finalVibe = "開心";
        for (const vibe in scores) {
            if (scores.hasOwnProperty(vibe) && scores[vibe] > maxScore) {
                maxScore = scores[vibe];
                finalVibe = vibe;
            }
        }
        if(resultTitleElement) resultTitleElement.textContent = `${userNickname}，你今天的 Vibe 是...`;
        if(finalVibeTextElement) finalVibeTextElement.textContent = finalVibe;

        const playlistId = vibePlaylists[finalVibe];
        const count = vibePlaylistCounts[finalVibe] || 1; // 確保 count 至少為 1
        const randomIndex = Math.floor(Math.random() * count);
        
        // *** 修改：將 mute 參數改為 1，嘗試靜音自動播放 ***
        const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}&index=${randomIndex}&autoplay=1&controls=1&mute=1`;

        console.log(`Playlist ID: ${playlistId}, Actual Video Count: ${count}, Chosen RandomIndex (0-based): ${randomIndex}`);
        console.log('FINAL YOUTUBE EMBED URL (mute=1):', embedUrl);

        if (youtubePlayerWrapper) {
            youtubePlayerWrapper.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.id = 'youtube-player-iframe';
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.src = embedUrl;
            iframe.title = "YouTube video player";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            
            iframe.onload = () => console.log("YouTube iframe content loaded (embed). src:", iframe.src);
            iframe.onerror = (e) => {
                console.error("YouTube iframe FAILED to load content (embed):", iframe.src, "Error event:", e);
                youtubePlayerWrapper.innerHTML = "<p>抱歉，影片載入失敗。可能是影片不允許嵌入、地區限制或網路問題。請確認播放清單內容是否正確，或稍後再試。</p>";
            };
            youtubePlayerWrapper.appendChild(iframe);
        } else {
            console.error("youtubePlayerWrapper not found for iframe embedding");
        }
    }

    function resetQuiz() {
        console.log("Executing resetQuiz()");
        currentQuestionIndex = 0;
        scores = { "開心": 0, "憂鬱": 0, "激昂": 0, "神秘": 0 };
        if(nicknameInput) nicknameInput.value = localStorage.getItem('vibeNickname') || '';
        if(youtubePlayerWrapper) youtubePlayerWrapper.innerHTML = '';
        switchScreen(resultContainer, welcomeContainer, startTypewriter);
        if (quizContainer) {
            quizContainer.style.display = 'none';
            quizContainer.classList.remove('do-fade-in', 'do-fade-out', 'hidden');
            quizContainer.classList.add('hidden');
        }
         if (questionArea) {
            questionArea.classList.remove('do-fade-in', 'do-fade-out');
        }
    }

    if(quizContainer) quizContainer.style.display = 'none';
    if(resultContainer) resultContainer.style.display = 'none';
    if(welcomeContainer) {
        welcomeContainer.style.display = 'block';
        startTypewriter();
    } else {
         console.error("CRITICAL ERROR during initial setup: 'welcome-container' NOT FOUND!");
    }
    
    console.log("--- DOMContentLoaded SCRIPT END ---");
});

console.log("--- script.js SCRIPT PARSED (End of file) ---");
