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


    // ローカルストレージからデータを取得する
    const listNotes = JSON.parse(localStorage.getItem('listNotes'))
    const titles = JSON.parse(localStorage.getItem('titles'))


    //  チェックリストのローカルデータ
    const checkList1 = JSON.parse(localStorage.getItem('checkListNumber1'))
    const checkList2 = JSON.parse(localStorage.getItem('checkListNumber2'))
    const checkList3 = JSON.parse(localStorage.getItem('checkListNumber3'))
    const checkList4 = JSON.parse(localStorage.getItem('checkListNumber4'))
    const checkList5 = JSON.parse(localStorage.getItem('checkListNumber5'))
    const checkList6 = JSON.parse(localStorage.getItem('checkListNumber6'))



    const checkMark = JSON.parse(localStorage.getItem('checkBoxMark'))



    // メモ帳追加処理を実行
    // 読み込みしたときにローカルストレージからデータを取得してきて
    // notesのデータがあるならtrueを返してaddNewNoteでnote作成

    if (listNotes && titles && checkList1 && checkList2 && checkList3 && checkList4 && checkList5 && checkList6) {
        listNotes.forEach(listNote => addNewNote(listNote, titles, checkList1, checkList2, checkList3, checkList4, checkList5, checkList6))
        checkBox_writeMark(checkMark)
    } else if (listNotes && titles && checkList1 && checkList2 && checkList3 && checkList4 && checkList5) {
        listNotes.forEach(listNote => addNewNote(listNote, titles, checkList1, checkList2, checkList3, checkList4, checkList5))
        checkBox_writeMark(checkMark)
    } else if (listNotes && titles && checkList1 && checkList2 && checkList3 && checkList4) {
        listNotes.forEach(listNote => addNewNote(listNote, titles, checkList1, checkList2, checkList3, checkList4))
        checkBox_writeMark(checkMark)
    } else if (listNotes && titles && checkList1 && checkList2 && checkList3) {
        listNotes.forEach(listNote => addNewNote(listNote, titles, checkList1, checkList2, checkList3))
        checkBox_writeMark(checkMark)
    } else if (listNotes && titles && checkList1 && checkList2) {
        listNotes.forEach(listNote => addNewNote(listNote, titles, checkList1, checkList2))
        checkBox_writeMark(checkMark)
    } else if (listNotes && titles && checkList1) {
        listNotes.forEach(listNote => addNewNote(listNote, titles, checkList1))
        checkBox_writeMark(checkMark)
    } else if (listNotes && titles) {
        listNotes.forEach(listNote => addNewNote(listNote, titles))
        checkBox_writeMark(checkMark)
    } else if (listNotes) {
        listNotes.forEach(listNote => addNewNote(listNote))
        checkBox_writeMark(checkMark)
    }

    // 作成ボタンのクリックイベントの登録
    addBtn.addEventListener('click', () => addNewNote())

    //memo_add.addEventListener('click', () => addNewNote())


    // text = ''とすることで引数に値がなくても実行できてる？
    function addNewNote(text = '', title = '', checkList1 = "", checkList2 = "", checkList3 = "", checkList4 = "", checkList5 = "", checkList6 = "") {




        // jsからhtml要素を作成するときはこういう風に作った方がいいのか。



        // div要素を作成
        const listNote = document.createElement('div')
            // noteクラスを追加
            // 多分IDの追加もできる
        listNote.classList.add('listNote')


        let note_length = noteLength_Get()

        listNote.setAttribute("id", `listNote${note_length}`)

        // title[note_length - 1]に要素が存在するならその値を要素が存在しないなら""空文字を代入
        title = title[note_length - 1] ? title[note_length - 1] : ""

        // チェックリストのローカルデータ読み込み
        checkList1 = checkList1[note_length - 1] ? checkList1[note_length - 1] : ""
        checkList2 = checkList2[note_length - 1] ? checkList2[note_length - 1] : ""
        checkList3 = checkList3[note_length - 1] ? checkList3[note_length - 1] : ""
        checkList4 = checkList4[note_length - 1] ? checkList4[note_length - 1] : ""
        checkList5 = checkList5[note_length - 1] ? checkList5[note_length - 1] : ""
        checkList6 = checkList6[note_length - 1] ? checkList6[note_length - 1] : ""







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
    <div class="command_textArea" ><input type="text" value="${title}" name="title${note_length}" id = "command_input${note_length}" class="title_input" autocomplete="off"></div>
    </div>

    <hr class="hr_commmandWindow top">

    <div class="itemform">
    <ul>
        <li class="command_form" >
    <input type="checkbox" name="item" class="checkbox" value="item1" />
    <label for="name"><input type="text" value="${checkList1}"  class="checkList_input checkListNumber1"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item" class="checkbox" value="item2"/>
      <label for="name"><input type="text" value="${checkList2}" class="checkList_input checkListNumber2"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item" class="checkbox" value="item3"/>
      <label for="name"><input type="text" value="${checkList3}" class="checkList_input checkListNumber3"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item" class="checkbox" value="item4"/>
      <label for="name"><input type="text" value="${checkList4}" class="checkList_input checkListNumber4"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item" class="checkbox" value="item5"/>
      <label for="name"><input type="text" value="${checkList5}" class="checkList_input checkListNumber5"><label>
    </li>
    <li class="command_form" >
      <input type="checkbox" name="item" class="checkbox" value="item6"/>
      <label for="name"><input type="text" value="${checkList6}" class="checkList_input checkListNumber6"><label>
    </li>
    </ul>
    </div>

    <div class="checkmark"></div>

    <div class="main ${text ? "" : "hidden"}">
        
    </div>
    <hr class="hr_commmandWindow">
    
    
    <div class="command_defaultMessage" id="cmd_message"></div>

    </div>
    <textarea spellcheck="False" id="main_note" class="${text ? "hidden" : ""}"></textarea>
    `

        // 操作に必要な要素を取得
        // ここの各要素は上のinnerHTMLのところで定義されてる
        const editBtn = listNote.querySelector('.edit')
        const deleteBtn = listNote.querySelector('.delete')
        const main = listNote.querySelector('.main')
            // const textArea = listNote.querySelector('textarea')
        const input = listNote.querySelector('input')


        // ここに移動すると一番後ろにあるチェックリストが機能しなくなる //
        // 下にあるやつとここにあるやつ二つ定義しておく

        const inputArea = document.getElementsByClassName("checkList_input");

        const inputAreas = Array.from(inputArea);

        inputAreas.forEach(function(inputArea) {

            // テキストエリアに引数で渡したテキストを代入
            // 新規/編集があるのでこうしている
            // textArea.value = text
            // inputArea.value = text

            // inputArea(チェックリストに入力時の処理)
            inputArea.addEventListener("input", function() {
                text = inputArea.value
                main.innerHTML = marked(text)
            });

            inputArea.addEventListener('mouseover', () => {
                inputArea.focus();
            }, false);

            inputArea.addEventListener('mouseleave', () => {
                inputArea.blur()
                updateLS()
            }, false);


        })


        // チェックボックスがクリックされた時点で保存を行う処理
        const checkBoxArea = document.getElementsByClassName("checkbox");
        const checkBoxAreas = Array.from(checkBoxArea);
        checkBoxAreas.forEach(function(checkBoxArea) {

            // テキストエリアに引数で渡したテキストを代入
            // 新規/編集があるのでこうしている
            // textArea.value = text
            // inputArea.value = text

            // inputArea(チェックリストに入力時の処理)
            checkBoxArea.addEventListener("click", function() {
                updateLS()
            });

        })




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

        // input bag
        // inputArea.addEventListener('mouseover', () => {



        //     // textArea.focus();
        //     inputArea.focus();


        // }, false);

        // // マウスが要素上から離れた時
        // // メモ帳のテキストエリアからマウスが離れたらフォーカスをblurで解除
        // // textArea.addEventListener('mouseleave', () => {
        // inputArea.addEventListener('mouseleave', () => {
        //     // textArea.blur()
        //     inputArea.blur()
        //         // フォーカスを外したらテキストエリアのスクロール状態を初期化したい

        // }, false);


        // コマンド入力欄関係
        input.addEventListener('mouseover', () => {

            input.focus()

        }, false);

        input.addEventListener('mouseleave', () => {

            input.blur()
                // フォーカスを外したらテキストエリアのスクロール状態を初期化したい

        }, false);



        // テキストエリアのイベント
        // テキストエリアにinputされたときにローカルストレージに保存
        // textArea.addEventListener('input', (e) => {[]

        // input bag

        // inputArea.addEventListener('input', (e) => {
        //     const { value } = e.target

        //     main.innerHTML = marked(value)

        //     // ローカルストレージの更新
        //     updateLS()
        // })

        // bodyの子要素として追加
        document.body.appendChild(listNote)
    }




    function text_save() {

        // const listNotesText = document.querySelectorAll('textarea')

        //querySelectorAllは要素の数をnodeで取得できる
        const listNotesText = document.querySelectorAll('textArea')
        const listNotes = []

        // 要素を格納
        listNotesText.forEach(listNote => listNotes.push(listNote.value))

        localStorage.setItem('listNotes', JSON.stringify(listNotes))

    }

    function title_save() {


        const titleText = document.getElementsByClassName("title_input")
        const titles = []
        for (let obj of titleText) {
            titles.push(obj.value)
        }

        localStorage.setItem('titles', JSON.stringify(titles))

    }

    function checkList_save() {


        // 1

        let checkList_Text = document.getElementsByClassName("checkListNumber1")
        let checkListText_array = []

        for (let obj of checkList_Text) {
            checkListText_array.push(obj.value)
        }

        localStorage.setItem('checkListNumber1', JSON.stringify(checkListText_array))

        // 2

        checkList_Text = document.getElementsByClassName("checkListNumber2")
        checkListText_array = []

        for (let obj of checkList_Text) {
            checkListText_array.push(obj.value)
        }

        localStorage.setItem('checkListNumber2', JSON.stringify(checkListText_array))

        // 3

        checkList_Text = document.getElementsByClassName("checkListNumber3")
        checkListText_array = []

        for (let obj of checkList_Text) {
            checkListText_array.push(obj.value)
        }

        localStorage.setItem('checkListNumber3', JSON.stringify(checkListText_array))

        // 4

        checkList_Text = document.getElementsByClassName("checkListNumber4")
        checkListText_array = []

        for (let obj of checkList_Text) {
            checkListText_array.push(obj.value)
        }

        localStorage.setItem('checkListNumber4', JSON.stringify(checkListText_array))

        // 5

        checkList_Text = document.getElementsByClassName("checkListNumber5")
        checkListText_array = []

        for (let obj of checkList_Text) {
            checkListText_array.push(obj.value)
        }

        localStorage.setItem('checkListNumber5', JSON.stringify(checkListText_array))

        // 6

        checkList_Text = document.getElementsByClassName("checkListNumber6")
        checkListText_array = []

        for (let obj of checkList_Text) {
            checkListText_array.push(obj.value)
        }

        localStorage.setItem('checkListNumber6', JSON.stringify(checkListText_array))



    }


    // チェックボックスのチェック状況を確認してローカルストレージに保存する
    function mark_save() {


        let targets = document.querySelectorAll(`input[type='checkbox'][name='item']`);
        // let targets = document.getElementsByClassName("checkbox")
        let marks = []

        for (let i of targets) {
            marks.push(i.checked)
        }

        localStorage.setItem('checkBoxMark', JSON.stringify(marks))


    }



    // ローカルストレージにメモ帳を保存
    function updateLS() {

        text_save()
        title_save()
        checkList_save()

        mark_save()




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


    // 汎用関数

    function noteLength_Get() {

        let note_length = Number(document.getElementsByClassName("listNote").length + 1)

        if (note_length == null) {
            note_length = 1
        } else {
            note_length = Number(document.getElementsByClassName("listNote").length + 1)
        }

        return note_length
    }

    function checkBox_writeMark(data = '') {

        let targets = document.querySelectorAll(`input[type='checkbox'][name='item']`);
        // data = JSON.parse(localStorage.getItem('checkBoxMark'))

        let count = 0

        for (let i of targets) {

            console.log(data[count])
            if (data[count] == true) {
                i.checked = true;
            } else {
                i.checked = false
            }
            count += 1
        }
    }


    //  ここに移動したら更新後なら動作する


    const inputArea = document.getElementsByClassName("checkList_input");

    const inputAreas = Array.from(inputArea);

    inputAreas.forEach(function(inputArea) {

        // テキストエリアに引数で渡したテキストを代入
        // 新規/編集があるのでこうしている
        // textArea.value = text
        // inputArea.value = text

        // inputArea(チェックリストに入力時の処理)
        inputArea.addEventListener("input", function() {
            text = inputArea.value
            main.innerHTML = marked(text)
        });

        inputArea.addEventListener('mouseover', () => {
            inputArea.focus();
        }, false);

        inputArea.addEventListener('mouseleave', () => {
            inputArea.blur()
            updateLS()
        }, false);


    })


    // チェックボックスがクリックされた時点で保存を行う処理
    const checkBoxArea = document.getElementsByClassName("checkbox");
    const checkBoxAreas = Array.from(checkBoxArea);
    checkBoxAreas.forEach(function(checkBoxArea) {

        // テキストエリアに引数で渡したテキストを代入
        // 新規/編集があるのでこうしている
        // textArea.value = text
        // inputArea.value = text

        // inputArea(チェックリストに入力時の処理)
        checkBoxArea.addEventListener("click", function() {
            updateLS()
        });

    })



    // *    プロンプト風にしたい    * //

    // 参考サイト https://dianxnao.com/htmljs%EF%BC%9Atextarea%E3%82%BF%E3%82%B0%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%82%92%E3%82%BF%E3%83%BC%E3%83%9F%E3%83%8A%E3%83%AB%E9%A2%A8%E3%81%AB%E8%A3%85/


}