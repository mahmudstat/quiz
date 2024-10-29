// Function to create a quiz HTML file based on user input
async function createQuizHTML() {
    // Gather user input from the form
    const collegeName = document.getElementById("collegeName").value;
    const examName = document.getElementById("examName").value;
    const className = document.getElementById("className").value;
    const subject = document.getElementById("subject").value;
    const examType = document.getElementById("examType").value;
    const paper = document.getElementById("paper").value;
    const time = document.getElementById("time").value;
    const fullMarks = document.getElementById("fullMarks").value;
    const subjectCode = document.getElementById("subjectCode").value;
    const set = document.getElementById("set").value;
    const numOfQuestions = parseInt(document.getElementById("numOfQuestions").value, 10);

    // Fetch questions from CSV
    const response = await fetch('math.csv'); // Ensure the path is correct
    const text = await response.text();
    const questions = parseCSV(text);

    // Shuffle and select the specified number of questions
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, numOfQuestions);

    // Create the HTML content
    let quizHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${examName}</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        #quiz-container {
            width: 80%;
            max-width: 800px;
            padding: 20px;
            background-color: #f8f8f8;
            border: 1px solid #000;
        }
        header {
            margin-bottom: 0;
        }
        .header-left {
            padding-left: 16px;
        }
        .header-right {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .header-box {
            border: 1px solid #000;
            padding: 5px 10px;
            display: inline-block;
            margin-top: 5px;
            font-size: 14px;
        }
        .subject-code-grid {
            display: inline-grid;
            grid-template-columns: auto auto auto auto;
            gap: 0;
            text-align: center;
            margin-top: 5px;
            font-size: 14px;
        }
        .header-details {
            margin-top: 0;
            font-size: 14px;
        }
        .question-title {
            text-align: left;
            margin-bottom: 10px;
            font-size: 13px;
        }
        .option-list {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 10px 0;
            font-size: 13px;
        }
        .instructions {
            font-size: 13px;
            margin-bottom: 20px;
            text-align: center;
        }
        .bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div id="quiz-container">
        <header class="header-left">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h1 style="font-size: 14px;">${collegeName}</h1>
                    <h2 style="font-size: 14px;">${examName}</h2>
                </div>
                <div class="header-right">
                    <div class="header-box">Set: ${set}</div>
                    <div class="header-box">
                        <div class="subject-code-grid">
                            <div>Subject Code:</div>
                            <div>${subjectCode.split('').join('</div><div>')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="header-details">
                <p style="margin: 0;"><strong>CLASS:</strong> ${className}</p>
                <p style="margin: 0;"><strong>${subject} (${examType})</strong></p>
                <p style="margin: 0;"><strong>${paper}</strong></p>
                <p style="margin: 0;"><strong>TIME:</strong> ${time}</p>
                <p style="margin: 0;"><strong>FULL MARKS:</strong> ${fullMarks}</p>
            </div>
            <hr>
        </header>

        <div class="instructions">
            [N.B. – Answer all the questions. Each question carries ONE mark. Block fully, with a black ball-point pen, the circle of the letter that stands for the correct/best answer in the “Answer sheet” for the Multiple Choice Questions Examination.]<br>
            <span class="bold">Candidates are asked not to leave any mark or spot on the question paper.</span>
        </div>

        <div id="questions-section">
`;

    // Generate question sections
    shuffledQuestions.forEach((q, index) => {
        quizHTML += `
            <div>
                <h3 class="question-title">Q${index + 1}. ${q.Question}</h3>
                <div class="option-list">
                    <span>A) ${q.Option1}</span>
                    <span>B) ${q.Option2}</span>
                    <span>C) ${q.Option3}</span>
                    <span>D) ${q.Option4}</span>
                </div>
            </div>
        `;
    });

    // Close the HTML tags
    quizHTML += `
        </div>
    </div>

    <script>
        // Trigger MathJax to render the equations
        MathJax.typeset();
    </script>
</body>
</html>
`;

    // Create a blob and download the file
    const blob = new Blob([quizHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to parse CSV data
function parseCSV(data) {
    const lines = data.split('\n').map(line => line.split(','));
    const headers = lines[0];
    const questions = lines.slice(1).map(line => {
        const questionObj = {};
        headers.forEach((header, index) => {
            questionObj[header.trim()] = line[index]?.trim().replace(/"/g, '');
        });
        return questionObj;
    });
    return questions.filter(q => q.Question); // Remove any empty questions
}
