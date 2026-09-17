/* =========================================================
   SIMPLE CHINESE CLASS WEBSITE
========================================================= */


/* =========================
   SAMPLE LOGIN DATA

   Later this will come from
   Google Sheets through Code.gs.
========================= */

const students = [
    {
        username: "student01",
        password: "123456",
        name: "Student One"
    },

    {
        username: "student02",
        password: "abc123",
        name: "Student Two"
    }
];


/* =========================
   SAMPLE CHAPTER DATA

   Later this will come from
   Google Drive JSON files.
========================= */

const chapters = [

    {
        chapter: "Chapter 1",
        title: "Basic Chinese",
        description: "Basic Chinese practice",

        parts: {

            part1: [
                {
                    id: 1,
                    question:
                        "Translate into Chinese Pinyin: မင်္ဂလာပါ"
                },

                {
                    id: 2,
                    question:
                        "Translate into Chinese Pinyin: ကျေးဇူးတင်ပါတယ်"
                }
            ],


            part2: [
                {
                    id: 1,
                    question:
                        "Nǐ jiào shénme míngzi?"
                },

                {
                    id: 2,
                    question:
                        "Nǐ shì nǎ guó rén?"
                }
            ],


            part3: [
                {
                    id: 1,

                    words: [
                        "jiào",
                        "wǒ",
                        "Shénme",
                        "míngzi"
                    ],

                    answer:
                        "wǒ jiào shénme míngzi"
                },

                {
                    id: 2,

                    words: [
                        "hǎo",
                        "nǐ",
                        "ma"
                    ],

                    answer:
                        "nǐ hǎo ma"
                }
            ]

        }
    },


    {
        chapter: "Chapter 2",

        title: "Daily Life",

        description:
            "Chinese vocabulary and daily conversation",

        parts: {

            part1: [
                {
                    id: 1,

                    question:
                        "Translate into Chinese Pinyin: ကျွန်တော် မနက် ၇ နာရီမှာ အိပ်ရာထတယ်။"
                }
            ],

            part2: [
                {
                    id: 1,

                    question:
                        "Nǐ shénme shíhòu qǐchuáng?"
                }
            ],

            part3: [
                {
                    id: 1,

                    words: [
                        "qǐchuáng",
                        "wǒ",
                        "qī",
                        "diǎn"
                    ],

                    answer:
                        "wǒ qī diǎn qǐchuáng"
                }
            ]

        }
    }

];


/* =========================
   CURRENT USER
========================= */

let currentUser = null;


/* =========================
   CURRENT EXAM
========================= */

let currentChapter = null;


/* =========================
   STUDENT ANSWERS
========================= */

let studentAnswers = {};


/* =========================
   PAGE ELEMENTS
========================= */

const loginPage =
    document.getElementById(
        "loginPage"
    );

const dashboardPage =
    document.getElementById(
        "dashboardPage"
    );

const examPage =
    document.getElementById(
        "examPage"
    );

const resultPage =
    document.getElementById(
        "resultPage"
    );


/* =========================================================
   LOGIN
========================================================= */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value
                    .trim();


            const student =
                students.find(
                    function(user) {

                        return (
                            user.username ===
                                username
                            &&
                            user.password ===
                                password
                        );

                    }
                );


            if (!student) {

                document
                    .getElementById(
                        "loginMessage"
                    )
                    .textContent =
                    "Invalid username or password.";

                return;

            }


            currentUser =
                student;


            document
                .getElementById(
                    "loginMessage"
                )
                .textContent =
                "";


            showDashboard();

        }
    );


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

    loginPage.classList.add(
        "hidden"
    );

    dashboardPage.classList.remove(
        "hidden"
    );

    examPage.classList.add(
        "hidden"
    );

    resultPage.classList.add(
        "hidden"
    );


    document
        .getElementById(
            "studentName"
        )
        .textContent =
        currentUser.name;


    renderChapters();

}


/* =========================================================
   RENDER CHAPTERS
========================================================= */

function renderChapters() {

    const container =
        document.getElementById(
            "chapterList"
        );


    container.innerHTML = "";


    chapters.forEach(
        function(chapter, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "chapter-card";


            card.onclick =
                function() {

                    openChapter(
                        index
                    );

                };


            card.innerHTML = `

                <div class="chapter-number">
                    ${chapter.chapter}
                </div>

                <h3>
                    ${chapter.title}
                </h3>

                <p>
                    ${chapter.description}
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   OPEN CHAPTER
========================================================= */

function openChapter(index) {

    currentChapter =
        chapters[index];


    studentAnswers = {};


    dashboardPage.classList.add(
        "hidden"
    );

    loginPage.classList.add(
        "hidden"
    );

    resultPage.classList.add(
        "hidden"
    );

    examPage.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "examTitle"
        )
        .textContent =
        currentChapter.chapter;


    document
        .getElementById(
            "examSubtitle"
        )
        .textContent =
        currentChapter.title;


    renderExam();

}


/* =========================================================
   RENDER EXAM
========================================================= */

function renderExam() {

    const container =
        document.getElementById(
            "examContent"
        );


    container.innerHTML = "";


    /* =========================
       PART 1
    ========================== */

    const part1Title =
        document.createElement(
            "h2"
        );

    part1Title.className =
        "part-title";

    part1Title.textContent =
        "Part 1 — Translation";

    container.appendChild(
        part1Title
    );


    currentChapter
        .parts
        .part1
        .forEach(
            function(question) {

                container.appendChild(
                    createTextQuestion(
                        question,
                        "part1"
                    )
                );

            }
        );


    /* =========================
       PART 2
    ========================== */

    const part2Title =
        document.createElement(
            "h2"
        );

    part2Title.className =
        "part-title";

    part2Title.textContent =
        "Part 2 — Question";

    container.appendChild(
        part2Title
    );


    currentChapter
        .parts
        .part2
        .forEach(
            function(question) {

                container.appendChild(
                    createTextQuestion(
                        question,
                        "part2"
                    )
                );

            }
        );


    /* =========================
       PART 3
    ========================== */

    const part3Title =
        document.createElement(
            "h2"
        );

    part3Title.className =
        "part-title";

    part3Title.textContent =
        "Part 3 — Scramble";

    container.appendChild(
        part3Title
    );


    currentChapter
        .parts
        .part3
        .forEach(
            function(question) {

                container.appendChild(
                    createScrambleQuestion(
                        question
                    )
                );

            }
        );

}


/* =========================================================
   TEXT QUESTION
========================================================= */

function createTextQuestion(
    question,
    part
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "question-card";


    card.innerHTML = `

        <div class="question-number">
            Question ${question.id}
        </div>

        <div class="question-text">
            ${question.question}
        </div>

        <input
            type="text"
            class="answer-input"
            id="${part}-${question.id}"
            placeholder="Your answer"
        >

    `;


    return card;

}


/* =========================================================
   SCRAMBLE QUESTION
========================================================= */

function createScrambleQuestion(
    question
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "question-card";


    const words =
        [...question.words];


    /*
     * Randomize words.
     */

    words.sort(
        function() {

            return Math.random() - 0.5;

        }
    );


    let selectedWords = [];


    card.innerHTML = `

        <div class="question-number">
            Question ${question.id}
        </div>

        <div class="question-text">
            Put the words in the correct order.
        </div>

        <div class="scramble-words"></div>

        <div
            class="scramble-answer"
            id="scramble-answer-${question.id}"
        >
            Select the words...
        </div>

    `;


    const wordsContainer =
        card.querySelector(
            ".scramble-words"
        );


    words.forEach(
        function(word) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "word-button";


            button.textContent =
                word;


            button.onclick =
                function() {

                    if (
                        selectedWords.includes(
                            word
                        )
                    ) {

                        return;

                    }


                    selectedWords.push(
                        word
                    );


                    button.classList.add(
                        "selected"
                    );


                    updateScrambleAnswer();

                };


            wordsContainer.appendChild(
                button
            );

        }
    );


    function updateScrambleAnswer() {

        const answerBox =
            card.querySelector(
                ".scramble-answer"
            );


        if (
            selectedWords.length === 0
        ) {

            answerBox.textContent =
                "Select the words...";

        } else {

            answerBox.textContent =
                selectedWords.join(
                    " "
                );

        }


        studentAnswers[
            "part3-" + question.id
        ] =
            selectedWords.join(
                " "
            );

    }


    return card;

}


/* =========================================================
   SUBMIT EXAM
========================================================= */

function submitExam() {

    /*
     * Collect Part 1 answers.
     */

    currentChapter
        .parts
        .part1
        .forEach(
            function(question) {

                const input =
                    document.getElementById(
                        "part1-" +
                        question.id
                    );


                studentAnswers[
                    "part1-" +
                    question.id
                ] =
                    input
                        ? input.value.trim()
                        : "";

            }
        );


    /*
     * Collect Part 2 answers.
     */

    currentChapter
        .parts
        .part2
        .forEach(
            function(question) {

                const input =
                    document.getElementById(
                        "part2-" +
                        question.id
                    );


                studentAnswers[
                    "part2-" +
                    question.id
                ] =
                    input
                        ? input.value.trim()
                        : "";

            }
        );


    /*
     * Confirm submission.
     */

    const confirmed =
        confirm(
            "Are you sure you want to submit your exam?"
        );


    if (!confirmed) {

        return;

    }


    console.log(
        "Student:",
        currentUser.username
    );


    console.log(
        "Chapter:",
        currentChapter.chapter
    );


    console.log(
        "Answers:",
        studentAnswers
    );


    /*
     * For now we only show the
     * submitted page.
     *
     * Code.gs will be connected later.
     */

    showResult();

}


/* =========================================================
   SHOW RESULT
========================================================= */

function showResult() {

    loginPage.classList.add(
        "hidden"
    );

    dashboardPage.classList.add(
        "hidden"
    );

    examPage.classList.add(
        "hidden"
    );

    resultPage.classList.remove(
        "hidden"
    );

}


/* =========================================================
   BACK TO DASHBOARD
========================================================= */

function backToDashboard() {

    showDashboard();

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    currentUser =
        null;

    currentChapter =
        null;

    studentAnswers =
        {};


    dashboardPage.classList.add(
        "hidden"
    );

    examPage.classList.add(
        "hidden"
    );

    resultPage.classList.add(
        "hidden"
    );

    loginPage.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "username"
        )
        .value =
        "";


    document
        .getElementById(
            "password"
        )
        .value =
        "";


    document
        .getElementById(
            "loginMessage"
        )
        .textContent =
        "";

}
