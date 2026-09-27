// ========================================
// 基本設定
// ========================================

// 班の数
const TEAM_COUNT = 60;

// 班を入れる配列
let teams = [];


// ========================================
// ゲーム用の変数
// ========================================

// ゲーム中かどうか
let gameStarted = false;

// 操作回数
let moveCount = 0;

// ゲーム開始時間
let startTime = 0;

// タイマー
let timer = null;

// 今回のターゲット班
let targetTeam = "";

// 目標順位
let targetPosition = 0;


// ========================================
// 班を作る
// ========================================

function createTeams() {

    teams = [];

    for (let i = 1; i <= TEAM_COUNT; i++) {

        teams.push("第" + i + "班");

    }

}


// ========================================
// ランダムな問題を作る
// ========================================

function createQuestion() {

    // ターゲットにする班をランダムに選ぶ
    const randomTeamIndex =
        Math.floor(Math.random() * TEAM_COUNT);

    targetTeam = teams[randomTeamIndex];


    // 目標順位をランダムに選ぶ
    targetPosition =
        Math.floor(Math.random() * TEAM_COUNT) + 1;


    // 現在の順位と目標順位が同じだったら
    // もう一度問題を作る
    if (randomTeamIndex + 1 === targetPosition) {

        createQuestion();

        return;
    }


    // 問題文を表示
    document.getElementById("question").textContent =
        targetTeam +
        "を #"
        + targetPosition +
        "まで移動させろ！";

}


// ========================================
// 班を画面に表示
// ========================================

function displayTeams() {

    const base =
        document.getElementById("base");

    base.innerHTML = "";


    for (let i = 0; i < teams.length; i++) {

        const team =
            document.createElement("div");


        // ターゲット班なら黄色にする
        if (
            gameStarted &&
            teams[i] === targetTeam
        ) {

            team.classList.add("target");

        }


        team.innerHTML = `

            <span>#${i + 1}</span>

            <span>${teams[i]}</span>

            <button
                onclick="moveDown(${i})">

                ⬇️

            </button>

            <button
                onclick="moveUp(${i})">

                ⬆️

            </button>

        `;


        base.appendChild(team);

    }

}


// ========================================
// ⬆️
// 1つ下へ移動
// ========================================

function moveDown(index) {

    // 一番下なら移動できない
    if (index === teams.length - 1) {

        return;

    }


    // 班を入れ替える

    let temp = teams[index];

    teams[index] =
        teams[index + 1];

    teams[index + 1] =
        temp;


    // ゲーム中なら操作回数を増やす

    if (gameStarted) {

        moveCount++;

        updateScore();

        checkGoal();

    }


    displayTeams();

}


// ========================================
// ⬇️
// 1つ上へ移動
// ========================================

function moveUp(index) {

    // 一番上なら移動できない
    if (index === 0) {

        return;

    }


    // 班を入れ替える

    let temp = teams[index];

    teams[index] =
        teams[index - 1];

    teams[index - 1] =
        temp;


    // ゲーム中なら操作回数を増やす

    if (gameStarted) {

        moveCount++;

        updateScore();

        checkGoal();

    }


    displayTeams();

}


// ========================================
// ゲーム開始
// ========================================

function startGame() {

    // 現在のゲームを停止
    clearInterval(timer);


    // 班を初期状態に戻す
    createTeams();


    // ランダム問題を作る
    createQuestion();


    // 操作回数を0にする
    moveCount = 0;


    // ゲーム開始
    gameStarted = true;


    // 開始時間
    startTime = Date.now();


    // 表示更新
    displayTeams();

    updateScore();


    // 結果表示を消す
    document.getElementById("result").textContent = "";


    // タイマー開始
    timer =
        setInterval(updateTime, 10);

}


// ========================================
// タイム更新
// ========================================

function updateTime() {

    if (!gameStarted) {

        return;

    }


    const now = Date.now();


    const time =
        (now - startTime) / 1000;


    document.getElementById("time").textContent =
        time.toFixed(2) + "秒";

}


// ========================================
// 操作回数更新
// ========================================

function updateScore() {

    document.getElementById("moves").textContent =
        moveCount + "回";

}


// ========================================
// ゴール判定
// ========================================

function checkGoal() {

    // ターゲット班の現在位置を探す

    const currentIndex =
        teams.indexOf(targetTeam);


    // 現在の順位
    const currentPosition =
        currentIndex + 1;


    // 目標順位に到達したか

    if (
        currentPosition === targetPosition
    ) {

        // ゲーム終了

        gameStarted = false;


        clearInterval(timer);


        // 最終タイム

        const finalTime =
            (Date.now() - startTime) / 1000;


        // 結果を表示

        document.getElementById("result").textContent =

            "クリア！ " +

            finalTime.toFixed(2) +

            "秒 / " +

            moveCount +

            "回";


    }

}


// ========================================
// 最初の画面
// ========================================

createTeams();

displayTeams();