"use strict";



window.onload = function() {


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



    /*メモ帳部分定義*/


    // 要素を取得する
    const addBtn = document.getElementById('add')

    //const memo_add = document.getElementById('memo_add')

    const memo_Allremove = document.getElementById('remove')

    const memo_Save = document.getElementById('save')


    // ローカルストレージからデータを取得する
    const notes = JSON.parse(localStorage.getItem('notes'))
    const titles = JSON.parse(localStorage.getItem('titles'))

    // メモ帳追加処理を実行
    // 読み込みしたときにローカルストレージからデータを取得してきて
    // notesのデータがあるならtrueを返してaddNewNoteでnote作成


    // ここのバグの原因はtiles[note_legth]の要素が存在しないから

    if (notes && titles) {
        notes.forEach(note => addNewNote(note, titles))
    } else if (notes) {
        notes.forEach(note => addNewNote(note))
    }

    addBtn.addEventListener('click', () => addNewNote())

    //memo_add.addEventListener('click', () => addNewNote())


    // text = ''とすることで引数に値がなくても実行できてる？
    function addNewNote(text = '', title = '') {

        // jsからhtml要素を作成するときはこういう風に作った方がいいのか。



        // div要素を作成
        const note = document.createElement('div')
            // noteクラスを追加
            // 多分IDの追加もできる
        note.classList.add('note')

        let note_length = noteLength_Get()

        note.setAttribute("id", `note${note_length}`)

        // title[note_length - 1]に要素が存在するならその値を要素が存在しないなら""空文字を代入
        title = title[note_length - 1] ? title[note_length - 1] : ""

        // メモ帳を追加
        // noteの中身はdivタグ
        // その中にinnerするから構造としては<div class=note> note.innerHTMLの内容 </div>ってことか
        note.innerHTML = `
    <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div id = "note_text${note_length}" class="main ${text ? "" : "hidden"}">
        
    </div>
    <hr class="hr_commmandWindow">
    <div class="command_window"> 
    <div class="command_defaultMessage" id="cmd_message">Title</div>
    <div class="command_textArea" ><input type="text" value="${title}" name="title${note_length}" id = "command_input${note_length}" class="command_input" autocomplete="off"></div>
    </div>
    <textarea spellcheck="False" id="main_note" class="${text ? "hidden" : ""}"></textarea>
    `

        // 操作に必要な要素を取得
        // ここの各要素は上のinnerHTMLのところで定義されてる
        const editBtn = note.querySelector('.edit')
        const deleteBtn = note.querySelector('.delete')
        const main = note.querySelector('.main')
        const textArea = note.querySelector('textarea')
        const input = note.querySelector('input')

        // テキストエリアに引数で渡したテキストを代入
        // 新規/編集があるのでこうしている
        textArea.value = text
            // markedは、HTMLに追加したプラグイン
            // このmainのところにメモ帳のテキストが格納されている
        main.innerHTML = marked(text)

        // 削除のクリックイベントの登録
        deleteBtn.addEventListener('click', () => {
            deleteNote(note)
        })

        //削除のクリックイベントの登録
        memo_Allremove.addEventListener('click', () => {
            deleteNote(note)
        })

        // セーブのクリックイベント登録
        memo_Save.addEventListener('click', () => {
            updateLS()
        })





        // 編集ボタンのクリックイベント
        editBtn.addEventListener('click', () => {
            editNote(main, textArea)
            textArea.focus();

        })

        // メモ帳入力関係
        // マウスが要素上に入った時
        // メモ帳がテキストエリアに入ったらフォーカスする
        textArea.addEventListener('mouseover', () => {



            textArea.focus();


        }, false);

        // マウスが要素上から離れた時
        // メモ帳のテキストエリアからマウスが離れたらフォーカスをblurで解除
        textArea.addEventListener('mouseleave', () => {

            textArea.blur()
                // フォーカスを外したらテキストエリアのスクロール状態を初期化したい

        }, false);


        // コマンド入力欄関係
        input.addEventListener('mouseover', () => {

            input.focus()
                // フォーカスを外したらテキストエリアのスクロール状態を初期化したい
            if (document.forms.command_input.command_input.value == "a") {
                console.log("a")
            }

        }, false);

        input.addEventListener('mouseleave', () => {

            input.blur()
                // フォーカスを外したらテキストエリアのスクロール状態を初期化したい

        }, false);



        // テキストエリアのイベント
        // テキストエリアにinputされたときにローカルストレージに保存
        textArea.addEventListener('input', (e) => {
            const { value } = e.target

            main.innerHTML = marked(value)

            // ローカルストレージの更新
            updateLS()
        })

        // bodyの子要素として追加
        document.body.appendChild(note)
    }



    // メモ帳削除
    function deleteNote(note) {
        // ノートを削除
        // 引数がないけどおそらくデフォルトで後に作ったやつは先に消してる
        note.remove()
            // ローカルストレージの更新
        updateLS()
    }

    // メモ帳編集
    function editNote(main, textArea) {
        // hiddenがついているものは消し、ついてないものは付与する
        main.classList.toggle('hidden')
        textArea.classList.toggle('hidden')

    }


    // 汎用関数

    function noteLength_Get() {

        let note_length = Number(document.getElementsByClassName("note").length + 1)

        if (note_length == null) {
            note_length = 1
        } else {
            note_length = Number(document.getElementsByClassName("note").length + 1)
        }

        return note_length
    }


    // ローカルストレージにメモ帳を保存
    function updateLS() {
        // 要素を取得
        const notesText = document.querySelectorAll('textarea')
        const notes = []

        // 要素を格納
        notesText.forEach(note => notes.push(note.value))


        const titleText = document.getElementsByClassName("command_input")
        const titles = []
        for (let obj of titleText) {
            titles.push(obj.value)
        }

        // notesという名前でローカルストレージを保存
        localStorage.setItem('notes', JSON.stringify(notes))
        localStorage.setItem('titles', JSON.stringify(titles))
    }



    // *    プロンプト風にしたい    * //

    // 参考サイト https://dianxnao.com/htmljs%EF%BC%9Atextarea%E3%82%BF%E3%82%B0%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%82%92%E3%82%BF%E3%83%BC%E3%83%9F%E3%83%8A%E3%83%AB%E9%A2%A8%E3%81%AB%E8%A3%85/


}