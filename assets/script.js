        let currentQuestion = 0;
        let score = 0;
        let userAnswers = [];
        let timer;
        let timeLeft = 10;

        function startTimer() {
            clearInterval(timer);
            timeLeft = 10;
            document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

            timer = setInterval(() => {
                timeLeft--;
                document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    checkAnswer(null);  // No answer selected, so treat as incorrect
                }
            }, 1000);
        }

        function loadQuestion() {
            const card = document.getElementById("card");
            card.style.animation = "none";
            void card.offsetWidth;  // Reflow to restart animation
            card.style.animation = "flip 0.5s";

            const questionData = quizData[currentQuestion];
            document.getElementById("question").textContent = questionData.question;
            document.getElementById("question-number").textContent = `Question ${currentQuestion + 1}/${quizData.length}`;

            const optionsDiv = document.getElementById("options");
            optionsDiv.innerHTML = "";
            questionData.options.forEach(option => {
                const optionDiv = document.createElement("div");
                optionDiv.classList.add("option");
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkAnswer(option);
                optionsDiv.appendChild(optionDiv);
            });

            startTimer();
        }

        function checkAnswer(answer) {
            clearInterval(timer);  // Stop the timer

            const questionData = quizData[currentQuestion];
            const correctAnswer = questionData.correct;
            const isCorrect = answer === correctAnswer;
            userAnswers.push({ question: questionData.question, chosen: answer, correct: correctAnswer });

            if (isCorrect) score++;

            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            const quizContainer = document.getElementById("quiz-container");
            quizContainer.innerHTML = `<h3>Quiz Completed!</h3><p class="score">Your Score: ${score}/${quizData.length}</p>`;

            userAnswers.forEach((item, index) => {
                const answerDiv = document.createElement("div");
                const answerClass = item.chosen === item.correct ? "correct" : "incorrect";
                answerDiv.classList.add("result-item", answerClass);
                answerDiv.innerHTML = `<strong>Q${index + 1}: ${item.question}</strong><br>
                                       Your answer: ${item.chosen || "No answer"}<br>
                                       Correct answer: ${item.correct}`;
                quizContainer.appendChild(answerDiv);
            });
        }

        loadQuestion();
