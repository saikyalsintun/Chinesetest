/* =========================================================
   CHINESE CLASS - SIMPLE SCRIPT
========================================================= */

 
/* =========================================================
   API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyQGOCKUtXI2JpEZQSYywauvzUlkiZpbOP_uhScvFo3130MEl9t-Q5krOZ6dFfg9bnZ/exec";


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let currentExam = null;

let currentChapter = null;

let scrambleAnswers = {};


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const examPage =
    document.getElementById("examPage");

const resultPage =
    document.getElementById("resultPage");


/* =========================================================
   API FUNCTION
========================================================= */

async function api(action, data = {}) {

    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: action,
                    ...data
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const result =
            await response.json();


        return result;


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        throw error;

    }

}


/* =========================================================
   LOGIN
========================================================= */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value
                    .trim();


            const message =
                document
                    .getElementById(
                        "loginMessage"
                    );


            if (!username || !password) {

                message.textContent =
                    "Please enter username and password.";

                return;

            }


            message.textContent =
                "Logging in...";


            try {

                const result =
                    await api(
                        "login",
                        {
                            username: username,
                            password: password
                        }
                    );


                if (
                    !result ||
                    !result.success
                ) {

                    message.textContent =
                        result?.message ||
                        "Invalid username or password.";

                    return;

                }


                currentUser =
                    result.student;


                message.textContent =
                    "";


                showDashboard();


            } catch (error) {

                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );


/* =========================================================
   SHOW DASHBOARD
========================================================= */

async function showDashboard() {

    loginPage.classList.add(
        "hidden"
    );

    examPage.classList.add(
        "hidden"
    );

    resultPage.classList.add(
        "hidden"
    );

    dashboardPage.classList.remove(
        "hidden"
    );


    document
        .getElementById("studentName")
        .textContent =
        currentUser?.username ||
        "Student";


    await loadChapters();

}


/* =========================================================
   LOAD CHAPTERS
========================================================= */

async function loadChapters() {

    const container =
        document.getElementById(
            "chapterList"
        );


    container.innerHTML = `

        <div class="chapter-card">

            <p>
                Loading chapters...
            </p>

        </div>

    `;


    try {

        const result =
            await api(
                "getChapters"
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to load chapters."
            );

        }


        const chapters =
            result.chapters || [];


        if (
            chapters.length === 0
        ) {

            container.innerHTML = `

                <div class="chapter-card">

                    <p>
                        No chapters available.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        chapters.forEach(
            function(chapter) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "chapter-card";


                card.innerHTML = `

                    <div class="chapter-number">
                        ${escapeHTML(
                            chapter.chapter
                        )}
                    </div>

                    <h3>
                        ${escapeHTML(
                            chapter.title
                        )}
                    </h3>

                    <p>
                        Start exercise
                    </p>

                `;


                card.addEventListener(
                    "click",
                    function() {

                        openChapter(
                            chapter.chapter
                        );

                    }
                );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="chapter-card">

                <p>
                    Unable to load chapters.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   OPEN CHAPTER
========================================================= */

async function openChapter(
    chapterName
) {

    dashboardPage.classList.add(
        "hidden"
    );

    examPage.classList.remove(
        "hidden"
    );


    document
        .getElementById("examTitle")
        .textContent =
        chapterName;


    document
        .getElementById("examSubtitle")
        .textContent =
        "Loading...";


    const content =
        document.getElementById(
            "examContent"
        );


    content.innerHTML = `

        <div class="question-card">

            <p>
                Loading exam...
            </p>

        </div>

    `;


    scrambleAnswers = {};


    try {

        const result =
            await api(
                "getExam",
                {
                    chapter:
                        chapterName
                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to load exam."
            );

        }


        currentExam =
            result.exam;


        currentChapter =
            chapterName;


        document
            .getElementById(
                "examTitle"
            )
            .textContent =
            currentExam.chapter ||
            chapterName;


        document
            .getElementById(
                "examSubtitle"
            )
            .textContent =
            currentExam.title ||
            "Chinese Exercise";


        renderExam();


    } catch (error) {

        console.error(error);


        content.innerHTML = `

            <div class="question-card">

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Unable to load exam."
                    )}
                </p>

            </div>

        `;

    }

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


    if (
        !currentExam ||
        !currentExam.parts
    ) {

        container.innerHTML = `

            <div class="question-card">

                <p>
                    No exam questions found.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Part 1
     */

    const part1 =
        currentExam.parts
            .part1_translation;


    if (
        part1 &&
        part1.questions
    ) {

        addPartTitle(
            container,
            "Part 1 — Translation"
        );


        part1.questions.forEach(
            function(question) {

                container.appendChild(
                    createTextQuestion(
                        question,
                        "part1_translation"
                    )
                );

            }
        );

    }


    /*
     * Part 2
     */

    const part2 =
        currentExam.parts
            .part2_question;


    if (
        part2 &&
        part2.questions
    ) {

        addPartTitle(
            container,
            "Part 2 — Question"
        );


        part2.questions.forEach(
            function(question) {

                container.appendChild(
                    createTextQuestion(
                        question,
                        "part2_question"
                    )
                );

            }
        );

    }


    /*
     * Part 3
     */

    const part3 =
        currentExam.parts
            .part3_scramble;


    if (
        part3 &&
        part3.questions
    ) {

        addPartTitle(
            container,
            "Part 3 — Scramble"
        );


        part3.questions.forEach(
            function(question) {

                container.appendChild(
                    createScrambleQuestion(
                        question
                    )
                );

            }
        );

    }

}


/* =========================================================
   PART TITLE
========================================================= */

function addPartTitle(
    container,
    title
) {

    const heading =
        document.createElement(
            "h2"
        );


    heading.className =
        "part-title";


    heading.textContent =
        title;


    container.appendChild(
        heading
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
            Question ${escapeHTML(
                String(question.id)
            )}
        </div>

        <div class="question-text">
            ${escapeHTML(
                question.question || ""
            )}
        </div>

        <input
            type="text"
            class="answer-input"
            data-part="${escapeHTML(part)}"
            data-question-id="${escapeHTML(
                String(question.id)
            )}"
            placeholder="Your answer"
            autocomplete="off"
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


    const questionId =
        String(question.id);


    const words =
        [...(
            question.words || []
        )];


    /*
     * Shuffle words.
     */

    shuffle(words);


    card.innerHTML = `

        <div class="question-number">
            Question ${escapeHTML(
                questionId
            )}
        </div>

        <div class="question-text">
            Put the words in the correct order.
        </div>

        <div class="scramble-words"></div>

        <div
            class="scramble-answer"
            id="scramble-answer-${escapeHTML(
                questionId
            )}"
        >
            Select the words...
        </div>

        <button
            type="button"
            class="word-reset-button"
        >
            Reset
        </button>

    `;


    const wordContainer =
        card.querySelector(
            ".scramble-words"
        );


    const answerContainer =
        card.querySelector(
            ".scramble-answer"
        );


    let selectedWords = [];


    words.forEach(
        function(word, index) {

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


            button.dataset.index =
                index;


            button.addEventListener(
                "click",
                function() {

                    /*
                     * Don't allow the same
                     * button to be selected twice.
                     */

                    if (
                        button.classList
                            .contains(
                                "selected"
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


                    updateAnswer();

                }
            );


            wordContainer.appendChild(
                button
            );

        }
    );


    card
        .querySelector(
            ".word-reset-button"
        )
        .addEventListener(
            "click",
            function() {

                selectedWords = [];


                wordContainer
                    .querySelectorAll(
                        ".word-button"
                    )
                    .forEach(
                        function(button) {

                            button.classList
                                .remove(
                                    "selected"
                                );

                        }
                    );


                updateAnswer();

            }
        );


    function updateAnswer() {

        if (
            selectedWords.length === 0
        ) {

            answerContainer.textContent =
                "Select the words...";

        } else {

            answerContainer.textContent =
                selectedWords.join(
                    " "
                );

        }


        scrambleAnswers[
            questionId
        ] =
            selectedWords.join(
                " "
            );

    }


    return card;

}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array;

}


/* =========================================================
   SUBMIT EXAM
========================================================= */

async function submitExam() {

    if (
        !currentExam ||
        !currentUser
    ) {

        alert(
            "Exam information is missing."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to submit this exam?"
        );


    if (!confirmed) {

        return;

    }


    const answers = [];


    /*
     * Part 1
     */

    const part1Inputs =
        document.querySelectorAll(
            '[data-part="part1_translation"]'
        );


    part1Inputs.forEach(
        function(input) {

            answers.push({

                part:
                    "part1_translation",

                questionId:
                    input.dataset.questionId,

                answer:
                    input.value.trim()

            });

        }
    );


    /*
     * Part 2
     */

    const part2Inputs =
        document.querySelectorAll(
            '[data-part="part2_question"]'
        );


    part2Inputs.forEach(
        function(input) {

            answers.push({

                part:
                    "part2_question",

                questionId:
                    input.dataset.questionId,

                answer:
                    input.value.trim()

            });

        }
    );


    /*
     * Part 3
     */

    const part3 =
        currentExam.parts
            .part3_scramble;


    if (
        part3 &&
        part3.questions
    ) {

        part3.questions.forEach(
            function(question) {

                answers.push({

                    part:
                        "part3_scramble",

                    questionId:
                        String(
                            question.id
                        ),

                    answer:
                        scrambleAnswers[
                            String(
                                question.id
                            )
                        ] || ""

                });

            }
        );

    }


    /*
     * Disable submit button.
     */

    const submitButton =
        document.querySelector(
            ".submit-button"
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Submitting...";

    }


    try {

        const result =
            await api(
                "submitExam",
                {

                    username:
                        currentUser.username,

                    exam:
                        currentExam,

                    answers:
                        answers

                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to submit exam."
            );

        }


        showResult();


    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "Unable to submit exam."
        );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Submit Exam";

        }

    }

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

    currentExam =
        null;

    currentChapter =
        null;

    scrambleAnswers =
        {};


    resultPage.classList.add(
        "hidden"
    );

    examPage.classList.add(
        "hidden"
    );

    loginPage.classList.add(
        "hidden"
    );

    dashboardPage.classList.remove(
        "hidden"
    );


    loadChapters();

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    currentUser =
        null;

    currentExam =
        null;

    currentChapter =
        null;

    scrambleAnswers =
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
        .value = "";


    document
        .getElementById(
            "password"
        )
        .value = "";


    document
        .getElementById(
            "loginMessage"
        )
        .textContent = "";

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   START
========================================================= */

console.log(
    "Chinese Class website loaded."
);
