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
    const listNotes = JSON.parse(localStorage.getItem('listNotes'))

    // メモ帳追加処理を実行
    // 読み込みしたときにローカルストレージからデータを取得してきて
    // listNotesのデータがあるならtrueを返してaddNewNoteでnote作成
    if (listNotes) {
        listNotes.forEach(listNote => addNewNote(listNote))
    }

    // 作成ボタンのクリックイベントの登録
    addBtn.addEventListener('click', () => addNewNote())

    //memo_add.addEventListener('click', () => addNewNote())


    // text = ''とすることで引数に値がなくても実行できてる？
    function addNewNote(text = '') {

        // jsからhtml要素を作成するときはこういう風に作った方がいいのか。



        // div要素を作成
        const listNote = document.createElement('div')
            // noteクラスを追加
            // 多分IDの追加もできる
        listNote.classList.add('listNote')

        // メモ帳を追加
        // noteの中身はdivタグ
        // その中にinnerするから構造としては<div class=note> note.innerHTMLの内容 </div>ってことか
        listNote.innerHTML = `
    <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    
    <div class="title">
    <label for="name">title:<label>
    <input type="text" name="title" id = "title" class="command_input">
    </div>

    <hr class="hr_commmandWindow top">

    <div class="itemform">
    <ul>
        <li class="command_form" >
    <input type="checkbox" name="item1" class="checkbox" value="item1" />
    <label for="name"><input type="text"  class="command_input"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item2" class="checkbox" value="item2"/>
      <label for="name"><input type="text" class="command_input"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item3" class="checkbox" value="item3"/>
      <label for="name"><input type="text" class="command_input"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item4" class="checkbox" value="item4"/>
      <label for="name"><input type="text" class="command_input"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item5" class="checkbox" value="item5"/>
      <label for="name"><input type="text" class="command_input"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item6" class="checkbox" value="item6"/>
      <label for="name"><input type="text" class="command_input"><label>
    </li>
    </ul>
    </div>

    <div class="checkmark"></div>

    <div class="main ${text ? "" : "hidden"}">
        
    </div>
    <hr class="hr_commmandWindow">
    
    
    <div class="command_defaultMessage" id="cmd_message">Command Prompt [Version 0.0.1]</div>

    </div>
    <textarea spellcheck="False" id="main_note" class="${text ? "hidden" : ""}"></textarea>
    `

        // 操作に必要な要素を取得
        // ここの各要素は上のinnerHTMLのところで定義されてる
        const editBtn = listNote.querySelector('.edit')
        const deleteBtn = listNote.querySelector('.delete')
        const main = listNote.querySelector('.main')
        const textArea = listNote.querySelector('textarea')
        const input = listNote.querySelector('input')

        const inputArea = listNote.querySelector('.command_input')

        // テキストエリアに引数で渡したテキストを代入
        // 新規/編集があるのでこうしている
        // textArea.value = text
        inputArea.value = text


        // markedは、HTMLに追加したプラグイン
        // このmainのところにメモ帳のテキストが格納されている
        main.innerHTML = marked(text)

        // 削除のクリックイベントの登録
        deleteBtn.addEventListener('click', () => {
            deleteNote(listNote)
        })

        //削除のクリックイベントの登録
        memo_Allremove.addEventListener('click', () => {
            deleteNote(listNote)
        })

        // セーブのクリックイベント登録
        memo_Save.addEventListener('click', () => {
            updateLS()
        })





        // 編集ボタンのクリックイベント
        editBtn.addEventListener('click', () => {
            // editNote(main, textArea)
            // textArea.focus();
            editNote(main, inputArea)
            inputArea.focus();

        })

        // メモ帳入力関係
        // マウスが要素上に入った時
        // メモ帳がテキストエリアに入ったらフォーカスする
        // textArea.addEventListener('mouseover', () => {
        inputArea.addEventListener('mouseover', () => {



            // textArea.focus();
            inputArea.focus();


        }, false);

        // マウスが要素上から離れた時
        // メモ帳のテキストエリアからマウスが離れたらフォーカスをblurで解除
        // textArea.addEventListener('mouseleave', () => {
        inputArea.addEventListener('mouseleave', () => {
            // textArea.blur()
            inputArea.blur()
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
        // textArea.addEventListener('input', (e) => {
        inputArea.addEventListener('input', (e) => {
            const { value } = e.target

            main.innerHTML = marked(value)

            // ローカルストレージの更新
            updateLS()
        })

        // bodyの子要素として追加
        document.body.appendChild(listNote)
    }

    // ローカルストレージにメモ帳を保存
    function updateLS() {
        // 要素を取得
        // const listNotesText = document.querySelectorAll('textarea')

        //バグの原因ここか

        //querySelectorAllは要素の数をnodeで取得できる
        const listNotesText = document.querySelectorAll('textArea')
        const listNotes = []

        // 要素を格納
        listNotesText.forEach(listNote => listNotes.push(listNote.value))

        // listNotesという名前でローカルストレージを保存
        localStorage.setItem('listNotes', JSON.stringify(listNotes))
    }

    // メモ帳削除
    function deleteNote(listNote) {
        // ノートを削除
        // 引数がないけどおそらくデフォルトで後に作ったやつは先に消してる
        listNote.remove()
            // ローカルストレージの更新
        updateLS()
    }

    // メモ帳編集
    // function editNote(main, textArea) {
    function editNote(main, inputArea) {
        // hiddenがついているものは消し、ついてないものは付与する
        main.classList.toggle('hidden')
            // textArea.classList.toggle('hidden')
        inputArea.classList.toggle('hidden')
    }


    // *    プロンプト風にしたい    * //

    // 参考サイト https://dianxnao.com/htmljs%EF%BC%9Atextarea%E3%82%BF%E3%82%B0%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%82%92%E3%82%BF%E3%83%BC%E3%83%9F%E3%83%8A%E3%83%AB%E9%A2%A8%E3%81%AB%E8%A3%85/


}