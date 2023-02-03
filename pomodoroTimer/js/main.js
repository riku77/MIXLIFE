/*
最初に。

変数の説明やビルドイン関数などの説明などで大分行数があるので
スクロールが面倒ならctrl+fで文字検索画面をだして関数群と入力したら関数のところまですぐに行けます

ctrl+fでの文字検索はソースを見て処理を理解するのに使用すると便利です
*/


/*

"use strict";についての説明

JavaScript(以下、JS）内でuse strictを宣言すると
コードがstrict（厳格）モードで実行されるようになる。

何が厳格になったの？
withの使用の禁止
eval内で宣言された変数のスコープ
単純名の削除の禁止
いくつかの識別子を予約語に
arguments の単純化
セキュアな JavaScript 作成の容易化
8進数表記の禁止 etc..

strictモードのコードは高速に実行することができる場合がある（JSエンジンによる最適化処理を困難にする誤りを修正するため）

*/

 

"use strict"; // 厳格モードが邪魔ならここ削除


/*ハンバーガーメニュー定義*/

const menuBtContainer = document.querySelector('.menu_bt_container');
const sampleSpMenu = document.querySelector('.sample_sp_menu');
const menuClose = document.querySelector('.menu_close');
const menuOpen = document.querySelector('.menu_open');

menuBtContainer.addEventListener('click', () => {
    sampleSpMenu.classList.toggle('active');
    menuClose.classList.toggle('active');
    menuOpen.classList.toggle('active');
});


/* localStorage関連の関数 */

function timeLimit_init() {

    if (localStorage.getItem("time_limit") === null) {
        return document.timer.elements[0].value;
    } else {
        return Number(localStorage.getItem("time_limit"))
    }
}


function timeLimitRest_init() {

    if (localStorage.getItem("timeRest_limit") === null) {
        return document.timer.elements[2].value;
    } else {
        return Number(localStorage.getItem("timeRest_limit"))
    }
}





{

    // -htmlの要素を取得して変数に代入してるだけ- //


    //id js-startを持つhtml要素を変数に代入している
    //これによってjs-startを持つhtml要素がクリックされたら関数を実行みたいなのがaddEventListenerを使えばできる
    //idは一つの要素にしか使えないのでhtml要素を変数に代入するならidを使ったほうが可読性が良い
    const start = document.getElementById("js-start");

    // この二つの変数も上と同じようなもの
    const stop = document.getElementById("js-stop");
    const reset = document.getElementById("js-reset");
    const config = document.getElementById("js-config");

    // 今どんな状況か表示している変数
    // comment.textContent = "Working...";
    // これはhtml要素の<p id="js-comment">Click Start</p>のところをjs側から変更するって命令
    const comment = document.getElementById("js-comment");

    // タイマーを画面に書き出している変数
    // 旧timer.jsだとformの値と画面に書き出した値が1秒ずれていたので
    // この変数を使ってるところを見ることでずれを直す参考になるかも
    const countTimer = document.getElementById("js-count-timer");
    countTimer.textContent = timeLimit_init() + ":00"

    //id js-rest-popupを持つhtml要素をaddするのとremoveするのに使っている
    // addするということはポップアップ画面を表示するということ
    // removeするということはポップアップ画面を消すということ
    const restPopup = document.getElementById("js-rest-popup");

    // start変数と同じ役割。この変数を持つhtml要素がクリックされたときに関数を実行
    const rest = document.getElementById("js-rest-btn");

    // start変数と同じ役割。この変数を持つhtml要素がクリックされたときに関数を実行
    const finish = document.getElementById("js-finish-btn");

    // restPopup変数と同じ役割。ポップアップを表示するかしないか
    const restartPopup = document.getElementById("js-restart-popup");

    // start変数と同じ役割。この変数を持つhtml要素がクリックされたときに関数を実行
    const restart = document.getElementById("js-restart-btn");

    // comment変数と同じ役割。合計勉強時間はjs側からhtmlに描写
    const totalTime = document.getElementById("js-total-time");

    // <audio id="js-audio" src="audio/school_bell.mp3"></audio>のsrc="audio/school_bell.mp3"を取得している
    // この変数を使ってBGMや効果音を流している
    const audio = document.getElementById("js-audio");



    // -初期設定みたいなもの- //

    // start関数が実行されたときにstartTime = Date.now(); となる
    // Date.now();はUTC (協定世界時)での1970年1月1日0時0分0秒から現在までの経過時間(UNIX時間)をミリ秒単位で返す
    // countDown関数のconst runningTime = timeLimit * 60 * 1000 - elapsedTime - (Date.now() - startTime);
    // stop関数のelapsedTime += Date.now() - startTime; で使われている
    // countDown関数の方はわからない、stop関数の方は、
    // stop関数を実行した時のUNIX時間とstart関数を押した時点でのUNIX時間を減算することで経過時間を求めているということか？
    // そういうもんなんだって認識でいいかな
    let startTime;

    // タイマーの時間。ここを15に変更したらタイマーの初期時間は15分になる
    // runningTimeの計算const runningTime = timeLimit * 60 * 1000 - elapsedTime - (Date.now() - startTime);と
    // if (runningTime < 0)を満たしたときに実行されるswitch文でも引数で使われている

    /*
    
    このswitch文ってつまりは勉強時間か休憩時間かを判断してるだけ
    timeLimitの値が5のときは休憩時間って判定して5分休憩
    timeLimitの値がdocument.timer.elements[0].value || 25:のときは勉強時間って判定してn時間勉強

    switch (timeLimit) {
                case 5:
                    restartPopup.classList.add("show");
                    break;

                case document.timer.elements[0].value || 25:
        
            }

    */

    // グローバル変数はvarで定義しないとダメ。letにしたらおかしくなる（設計変えたら何とかなるとは思う）
    var timeLimit = timeLimit_init()
        // localStorageに保存されたデータがあるならそれをデフォルト値として使用
    if (localStorage.getItem("time_limit") !== null) {
        document.timer.elements[0].value = localStorage.getItem("time_limit")
    }


    // フローティングウィンドウで書き換えた値を保存するために使用
    var timeLimit_clone = timeLimit

    // timeLimit_restのデフォルト値はdocument.timer.elements[2].value = 5
    var timeLimit_rest = timeLimitRest_init();

    if (localStorage.getItem("timeRest_limit") !== null) {
        document.timer.elements[2].value = localStorage.getItem("timeRest_limit")
    }

    // フローティングウィンドウで書き換えた値を保存するために使用
    var timeLimit_rest_clone = timeLimit_rest

    // countDown関数とclearTimeout関数の引数で使われている
    // カウントして時間を1秒ずつ減らしていくのに使われている変数かな？
    let timeoutId;

    // elapsed(経過)Time(時間)
    // stop関数が実行されたときには elapsedTime += Date.now() - startTime;
    // reset関数が実行されたときとif(runningTime < 0)を満たすときは elapsed = 0
    // runningTimeの定義はconst runningTime = timeLimit * 60 * 1000 - elapsedTime - (Date.now() - startTime);
    // シンプルに経過時間を格納している変数かな。5秒経過したらelapsedTimeの値は5になっているはず
    let elapsedTime = 0;

    // 合計時間の算出に使われている変数
    // const calcTime = timeLimit * num;
    // つまり、一回目のループは num = 1 で timeLimitが25分だとしたら25*1でトータル25分の勉強時間
    // 5分休憩したあとの2回目のループでは25*2でトータル50分の勉強時間ってのをやりたいだけ
    let num = 0;

    let count = 0;

    var state = 'running';


    // -このjsファイルで使われているビルドイン関数の説明- //

    // Date.now() = UTC (協定世界時)での1970年1月1日0時0分0秒から現在までの経過時間(UNIX時間)をミリ秒単位で取得

    // setTimeout(引数) = 指定したミリ秒毎に関数を実行。ループ処理

    // clearTimeout(引数) = setTimeoutの解除、引数にはsetTimeoutの同じものを渡す。ループ解除処理

    // initButtonState()  = ボタン状態の初期化(多分),情報少ないからわからないけど
    //reset関数のトップに置かれてるから初期化なのは合ってるかな?おまじない的な感じで使ってもいいかも

    // HTMLMediaElement.play() = HTMLMediaElementに設定したMediaを再生する

    // HTMLMediaElement.pause(); = 再生しているmediaを停止する

    // String.prototype.padStart() = ゼロパディングしたいときに使える関数
    // 変数が文字列型じゃないと使えないので数値型変数からゼロパディングして画面に描画したいときは数値型変数をキャストすること
    // 例:  String(d.getMinutes()).padStart(2, "0");





    // - 参考になりそうな書き方 - //

    // html要素のcssをjavaScriptから変更する
    /*
        参考サイト:https://magazine.techacademy.jp/magazine/31008
        こんな感じでjavaScript側からcss要素を変更することができるみたい
        reset.disabled = true;
        start.style.opacity = 1;
    */

    // ${変数} で printf
    /*
    こんな感じでjavaScriptでもprintfが使える
    totalTime.textContent = `Total: ${calcTime}分`;
    */

    // onclickとaddEventListenerの違い
    /*
    参考サイト: https://qiita.com/KKKarin/items/ccb8ed361ab9acd1f9cf
    参考サイト2: https://iwb.jp/javascript-html-onclick-attribute-dont-use/

    簡潔にいうとonclick使うよりaddEventListener使った方がいいって感じ
    
    使用例:
    これでjs-stopをidに持つbutton要素をクリックすると処理を実行という風になる
    const stop = document.getElementById("js-stop");
    stop.addEventListener("click", () => {
        処理
    });

    */






    // インスタンスの作成
    const jsFrame = new JSFrame({
        // 位置の指定。横がleft 縦がbottomなので左下にウィンドウを作成
        horizontalAlign: 'left', //You can specify 'left' and 'right' for horizontalAlign.
        verticalAlign: 'bottom', //You can also specify 'top' and 'bottom' for the verticalAlign
    });

    // ウィンドウの大きさの定義
    const width = 300;
    const height = 320;
    const margin = 10;


    // インスタンスを使って実際にウィンドウを作成する
    const frame = jsFrame.create({
            name: `Win`,
            title: `フローティングウィンドウ`,
            // horizontalAlignをleftにした時はここはrightにする
            right: -width - margin,
            top: -height - margin,
            width,
            height,
            minWidth: 200,
            minHeight: 110,
            appearanceName: 'material',
            appearanceParam: {
                titleBar: {
                    color: 'white',
                    background: '#333333',
                }
            },
            style: {
                backgroundColor: 'rgba(255,255,255,0.8)',
                overflow: 'auto'
            },

            // ここにウィンドウに表示するhtml要素とかを定義する
            html: '  <form name="timer1"><input type="text" id="test" value="0" placeholder="分" class="timer_hide"><input id="time_change" type="button" class="start_css" value="▶" ><br><input  type="text" value="0" placeholder="休憩時間" class="timer_hide"><input type="button" id="rest_change" class="start_css" value="▶" ></form>',

            //ここにあるshow();を消すことで特定のボタンが押されたら初めてウィンドウ表示みたいにできる
        }) //.show();


    // ウィンドウにある小窓化などのボタンを定義
    frame.setControl({
        //ウィンドウを大きくするやつ
        maximizeButton: 'maximizeButton',
        //ウィンドウを大きくした後に更に小さくするやつ
        demaximizeButton: 'restoreButton',
        // ウィンドウを小さくするやつ
        minimizeButton: 'minimizeButton',
        // 小さくしたウィンドウを戻すやつ
        deminimizeButton: 'deminimizeButton',
        hideButton: 'closeButton',
        animation: true,
        animationDuration: 150,

    });

    // これでウィンドウ内のボタンに関数を設定できる
    // この関数をどこに置くかでポモドーロ終了時にウィンドウだせるかどうかが決まる
    frame.on('#time_change', 'click', (_frame, evt) => { timeLimit = document.timer1.elements[0].value, timeLimit_clone = timeLimit; });
    frame.on('#rest_change', 'click', (_frame, evt) => { timeLimit_rest = document.timer1.elements[2].value; });


    // closeボタンが押されたときに何らかの処理をする
    frame.control.on('hid', (frame, info) => {
        // これは消してもcloseされるっぽい
        frame.closeFrame();
    });

    //Callback when calling after mazimization
    //maximizedボタンがクリックされたときにトーストを表示する
    frame.control.on('maximized', (frame, info) => {
        jsFrame.showToast({
            text: 'トースト:ウィンドウを最大化'
        });
    });

    // クリック時の処理が定義されてないだけ
    frame.control.on('demaximized', (frame, info) => {});
    frame.control.on('minimized', (frame, info) => {});
    frame.control.on('dminimized', (frame, info) => {});


    
    // - ここから下は関数群 -//



    // タイマーを画面に書き出す処理
    // このソース内では変数runningTimeを引数にupdateTimer関数が実行されている
    function updateTimer(t) {
        // runningTimeを引数にdate関数を実行
        // runningTimeの中身は1499887みたいな感じのミリ秒の値
        // このミリ秒をdate関数が上手いこと処理しているということかな
        const d = new Date(t);
        // getMinutes = 引数で渡したミリ秒から分数だけ取得
        // padStart = ゼロパディングするための関数
        // (2, "0")というのは最低文字数が2文字で1文字のときは0を埋め込むことで強制的に2文字にするということ
        // padStartは変数が文字列型じゃないといけないのでString(引数)で文字列型にキャスト
        const m = String(d.getMinutes()).padStart(2, "0");
        // getSeconds = 引数で渡したミリ秒から秒数だけ取得
        const s = String(d.getSeconds()).padStart(2, "0");
        // 分数と秒数をhtmlに描画
        countTimer.textContent = `${m}:${s}`;
    }

    // タイマーのカウントダウンの処理
    function countDown() {
        const runningTime =
            timeLimit * 60 * 1000 - elapsedTime - (Date.now() - startTime);

        //runningTimeの値がどんな感じなのかデバッグしたいとき用
        //console.log(runningTime)

        // runningTimeが0より小さいということはタイマーが終了したということ
        if (runningTime < 0) {
            // ミリ秒経過によるループ処理の終了
            clearTimeout(timeoutId);
            // ボタンの初期化（多分htmlにある全ボタンの初期化）
            initButtonState();
            move("kyuukei");
            // 経過時間を0にする
            elapsedTime = 0;
            // mediaを再生
            audio.play();
            // case 5なら休憩時間の終了
            // case document.timer.elements[0].value || 25:なら勉強時間の終了と判定する
            switch (timeLimit) {
                // この条件を満たすときは勉強時間と休憩時間が一緒ということ
                // そして勉強時間と休憩時間が同じだとバグが発生するらしい
                // timeLimitの値がtimeLimit_restと同じ場合は以下の処理
                case timeLimit_rest:
                    // comment.text.Contentが勉強中の物なら勉強時間が0になったときに休憩画面を表示
                    if (comment.textContent == "Working...") {
                        calcTime();
                        restPopup.classList.add("show");
                        const text = document.getElementById('text');
                        count = count + 1
                        text.innerHTML = "現在　" + count + "　ポモドーロ";
                        const html_timelimit = document.getElementById('html-timelimit')
                        html_timelimit.innerHTML = +timeLimit+"分が経ちました!"
                    }
                    // comment.text.Contentが休憩中の物なら休憩時間が0になったときに勉強再開画面を表示
                    else if (comment.textContent == "Rest Time") {
                        restartPopup.classList.add("show");

                    }
                    // このbreakがないと下のcaseも実行される可能性がある
                    break;
                    // 休憩を開始するrest関数からcountDown関数に来た場合はtimeLimit = 5にする処理があるので
                    // この条件を満たす
                    // timeLimitの値がdocument.timer.elements[2]と同じまたは5のときは
                    // この周回では休憩時間が終わったと判定する
                    // このcaseは上のcaseと内容被ってて冗長的かも
                case timeLimit_rest || 5:
                    // 勉強時間をリスタートするためにポップアップ画面を表示
                    restartPopup.classList.add("show");
                    break;
                    // timerの入力フォームに入力した時間がたったら休憩ウィンドウをポップアップする
                    // document.timer.elements[0].value || 25:というのは
                    // formで指定したタイマー時間またはデフォルトの25なら処理を実行といった感じ
                    // 左辺に設定しているdocument.timer.elements[0].valueのが優先度は高い
                    // 初回にstart関数経由までここまで来た場合は
                    // document.timer.elements[0].value || 25:を必ず満たす
                    // なぜならstart関数からここに来るまでの処理にtimeLimitを5にする処理がないので
                case timeLimit || 25:
                    // 合計勉強時間を計算
                    calcTime();
                    // 休憩を開始するためのポップアップ画面を表示
                    restPopup.classList.add("show");
                    const text = document.getElementById('text');
                    const html_timelimit = document.getElementById('html-timelimit')
                    html_timelimit.innerHTML = +timeLimit+"分が経ちました!"
                    count = count + 1
                    text.innerHTML = "現在　" + count + "　ポモドーロ";
                    

                    break;
            }
            return;
        }

        // 画面にタイマーを描画
        updateTimer(runningTime);
        





        move()
        





        // 100ミリ秒ごとにcountDown関数を実行
        //アロー関数で定義している
        //アロー関数を使うメリットはthisを拘束しないこと
        //thisは原則、コードを上に遡って一番最初に見つけたオブジェクトを参照する。この制約を回避できる
        //定義の仕方: 変数 = 関数名(引数) => {処理}
        //参考サイト:https://webstyle.work/jjsarrowfunction/
        timeoutId = setTimeout(() => {
            countDown();
        }, 100);
    }


    // 合計時間の算出
    // このままだと途中でtimeLimitの値をform要素から変更したときにトータルを求める式が正常に動作しなくなりそうだから要改善
    // timeLimitが変更されたときにnumの値を初期化する処理とか
    // calcTimeは=じゃなくて+=にする必要があるかな
    // calcTime+=TimeLimitにしたら1回目は0+25で25
    //2回目は25+25で50、3回目はtimeLimitを5にしたとして25+25+5で55ってトータル求めれそう？
    function calcTime() {
        // ループ(n時間勉強してn時間休憩)を繰り返すごとにnumは増えていく最初のループ時はnum = 1
        ++num;
        // 1回目は25*num(1)だとして値は25 2回目は25*num(2)で値は50
        // 2回目が終えた時点で合計50分勉強してるんだからこの式で勉強時間のトータルが求めらることがわかる
        const calcTime = timeLimit * num;
        // 合計勉強時間の表示
        // ${calcTime} はpythonでいうところのprintfみたいなもの f"{calcTime}分"
        totalTime.textContent = `Total: ${calcTime}分`;
    }

    // ボタンを押したら音を止める処理
    function stoppedSound() {
        audio.pause();
        audio.currentTime = 0;
    }

    // 最初のボタンの状態
    function initButtonState() {
        // javaScriptからhtml要素のcssを変更している
        start.disabled = false;
        stop.disabled = true;
        reset.disabled = true;
        start.style.opacity = 1;
        stop.style.opacity = 0.4;
        reset.style.opacity = 0.4;
    }

    // カウント中のボタンの状態
    function setButtonStateRunning() {
        start.disabled = true;
        stop.disabled = false;
        reset.disabled = true;
        start.style.opacity = 0.4;
        stop.style.opacity = 1;
        reset.style.opacity = 0.4;
    }

    // カウントダウンが止まっている時のボタンの状態
    function setButtonStateStopped() {
        start.disabled = false;
        stop.disabled = true;
        reset.disabled = false;
        start.style.opacity = 1;
        stop.style.opacity = 0.4;
        reset.style.opacity = 1;
    }

    initButtonState();

    // Startボタンを押した時の処理
    start.addEventListener("click", () => {
        // 関数の実行。カウント中のボタンの状態
        setButtonStateRunning();
        // startTimeにUNIX時間を代入
        startTime = Date.now();
        // countDown関数を実行
        // countDonw関数の中でsetTimeoutしてcountdown関数を100ミリ秒ごとに実行って構造になっている
        countDown();
        // 現在の状況を説明するhtml要素commentに状況を描画
        comment.textContent = "Working...";
        move("start");
        
        
        

        
    });

    // Stopボタンを押した時の処理
    stop.addEventListener("click", () => {
        // setTimeoutのループ処理を停止
        clearTimeout(timeoutId);
        // 関数の実行。カウントダウンが止まっている時のボタンの状態
        setButtonStateStopped();
        // 経過時間を求める
        elapsedTime += Date.now() - startTime;
        // // 現在の状況を説明するhtml要素commentに状況を描画
        comment.textContent = "Stop";
        move("stop");

        
        

        
    });

    // Resetボタンを押した時の処理
    reset.addEventListener("click", () => {
        // ボタンの初期化
        initButtonState();
        // 経過時間を0にする
        elapsedTime = 0;
        // ポモドーロの周回回数を0にする
        count = 0;
        text.innerHTML = "現在　" + count + "　ポモドーロ";
        num = 0;
        // timeLimitにformで入力した値を代入
        timeLimit = document.timer.elements[0].value;

        // 現在の状況を説明するhtml要素commentに状況を描画
        countTimer.textContent = `${timeLimit}:00`;
        comment.textContent = "Click Start";
        move("reset")
        
    });




    // 雑になったけど要素を表示/表示を繰り返すコピペ可能なコード
    /* 
    結局このコードでやりたいことはfalseの時にtrueにして要素を表示
    trueの時にfalseにして要素を非表示するのを繰り返す。それだけ
    */
    function should_show_elements() {

        // 関数内で定義されているので本来なら外側からはアクセスできない変数
        // javaでいうgetter/setter/カプセル化みたいなもの
        // boolean型の初期値はfalseが良いらしい(初期状態では設定画面は表示されてないしね)
        let elements_state = false

        // returnする関数closure()の中に関数の定義や処理を書いていく
        function closure() {

            function show_elements() {
                // falseからtrueに反転して戻り値を返す
                return elements_state = !elements_state
            }

            function close_elements() {
                // trueからfalseに反転して戻り値を返す
                return elements_state = !elements_state
            }

            // 三項演算子。条件がTrueのときは左辺を条件がFalseの時は右辺を実行
            // elements_state=falseが真の時にshow_elementsを実行してelements_stateを反転してtrueにする
            // elements_state=falseが偽の時にclose_elementsを実行してelements_stateを反転してfalseにする
            return (!elements_state) ? show_elements() : close_elements();

        }

        // 関数の処理をreturn先の変数で実行すると考えていい
        return closure;

    }

    // 関数が変数として参照され続けているので
    // jsの参照されていないものは削除するという仕様を回避している
    const should_show = should_show_elements();


    // configボタンを押した時の処理
    config.addEventListener("click", () => {
        



        // タイマー稼働中に設定する場合はカウントを止める
        if (comment.textContent == "Working...") {
            clearTimeout(timeoutId);
            elapsedTime += Date.now() - startTime;
        }

        // config画面の表示（フローティングウィンドウ）
        // クロージャー関数の戻り値をswitch分の判定に使っている
        switch (should_show()) {

            case true:
                // ここのframe.showと
                frame.show();
                break;

            case false:
                // ここのframe.hideを変更したら他の要素をクリックする毎に
                // 表示/非表示させることができる
                frame.hide();
                break;
        }


        // 現在の状況を説明するhtml要素commentに状況を描画
        comment.textContent = "setting";
    });


    // 休憩するボタンを押した時の処理
    rest.addEventListener("click", () => {
        // 休憩するか終了するかの二択を選ぶポップアップ画面をremoveして非表示にする
        // 選択肢を選んだ後なのでポップアップ画面は必要ないので
        restPopup.classList.remove("show");
        // 音楽を止める関数の実行
        stoppedSound();
        // timeLimitの値を5にする。 休憩時間のデフォルト値が5分なので。



        // document.timer.elements[2].valueが5ならデフォルト値がそのままとしてtimeLimitに5を代入
        if (timeLimit_rest == 5) {
            timeLimit = 5
        }
        // document.timer.elementsの値が5以外なら入力フォームの値をtimeLimitに代入
        else {
            timeLimit = timeLimit_rest;
        }

        // 何分休憩するかをhtml要素として画面に描画
        countTimer.textContent = `${timeLimit}:00`;

        // startボタンをクリックする = start関数の実行
        // start関数内でcountdown関数を実行して
        // timeLimitが5なのでcountdown関数内のswitch文でcase5を通って
        // 最終的には勉強を再開するかどうかのポップアップ画面を表示
        start.click();

        // 現在の状況を説明するhtml要素commentに状況を描画
        comment.textContent = "Rest Time";
    });

    // 終了するボタンを押した時の処理
    finish.addEventListener("click", () => {
        restPopup.classList.remove("show");
        stoppedSound();
        count = 0;
        text.innerHTML = "現在　" + count + "　ポモドーロ";
        num = 0;
        countTimer.textContent = `${timeLimit}:00`;
        comment.textContent = "Click Start";
    });

    // 再開するボタンを押した時の処理
    restart.addEventListener("click", () => {
        restartPopup.classList.remove("show");
        stoppedSound();
        timeLimit = timeLimit_clone;
        countTimer.textContent = `${timeLimit}:00`;
        start.click();
        comment.textContent = "Working...";
    });
}


function time_change() {

    // timeLimitにformで入力した値を代入
    timeLimit = document.timer.elements[0].value;
    timeLimit_clone = timeLimit
    document.getElementById("js-count-timer").textContent = document.timer.elements[0].value + ":00";

}

// index.htmlのonclickから関数実行するのを辞めて
// 要素がクリックされたらjs側で判定して関数を実行するように変更
document.timer.elements[1].addEventListener('click', () => {
    localStorage.setItem('time_limit', JSON.stringify(Number(document.timer.elements[0].value)))
    time_change();
});


// 休憩時間を変更するためのメソッド
// このメソッドが実行されないということはtimeLimit_restの値はデフォルト値の5
function timeLimit_rest_change() {

    // document.timer.elements[2].value = <input type="text" value="1" placeholder="休憩時間" class="timer_hide">
    // のvalueを取得
    timeLimit_rest = document.timer.elements[2].value;
    timeLimit_rest_clone = timeLimit_rest

    //デバッグ用
    //console.log(timeLimit_rest)
}


document.timer.elements[3].addEventListener('click', () => {
    localStorage.setItem('timeRest_limit', JSON.stringify(Number(document.timer.elements[2].value)))
    timeLimit_rest_change();

});

function move(flag) {
    
    const objBox = document.querySelector(".circle_class")

    objBox.classList.add('pie');
    
    const num = timeLimit*60*2
    objBox.style.animationDuration=`${num}s`;
    

    
    if (flag == "stop"){
        objBox.style.animationPlayState = 'paused';
    }else if(flag == "start"){
        objBox.style.animationPlayState = 'running';
        
    }else if(flag == "kyuukei"){
        objBox.style.animationPlayState = 'paused';
        objBox.classList.remove('pie');
        objBox.style.animationPlayState = 'running';
    
    }else if(flag == "reset"){
        objBox.style.animationPlayState = 'paused';
        objBox.classList.remove('pie');
        

    }
    
    
   
}
