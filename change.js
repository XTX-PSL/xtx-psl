const change = document.querySelector('#change button')
const nameForm = document.querySelector('#nameForm')
const xia = document.querySelector('.flowtime .xia')
let xiaFlag = 0;
xia.addEventListener('click', function () {
    if (xiaFlag % 2 == 0) {
        xia.innerHTML = "<"
        change.style.display = "flex"
        console.log('dianjile');

    }
    else {
        xia.innerHTML = ">"
        change.style.display = "none"
    }
    xiaFlag++;
})
change.addEventListener('click', function () {
    if (change.innerHTML === "修改") {
        change.innerHTML = "隐藏"
        nameForm.style.display = "flex"
    }
    else {
        change.innerHTML = "修改";
        nameForm.style.display = "none";
    }

})
function replaceNames(boyName1 = "XXX1", girlName1 = "XX") {
    var boyName = document.getElementById('boyName').value;
    var girlName = document.getElementById('girlName').value;
    var elements = document.querySelectorAll('[contenteditable="true"]');
    elements.forEach(function (element) {
        var boyNameRegex = new RegExp(boyName1, "g");
        var girlNameRegex = new RegExp(girlName1, "g");
        element.innerHTML = element.innerHTML.replace(boyNameRegex, boyName)
        element.innerHTML = element.innerHTML.replace(girlNameRegex, girlName)
        const nameForm = document.querySelector('#nameForm')
        nameForm.style.display = "none"
        const change = document.querySelector('#change')
    })

}
let flag = 0;
let boy = "";
let girl = "";
const btn = document.getElementById('tijiao');
btn.addEventListener('click', function () {
    var boyName = document.getElementById('boyName').value;
    var girlName = document.getElementById('girlName').value;
    if (boyName && girlName) {
        if (flag === 0) {
            replaceNames();
            boy = document.getElementById('boyName').value;
            girl = document.getElementById('girlName').value;

            flag++;
        }
        else {
            replaceNames(boy, girl);
            boy = document.getElementById('boyName').value;
            girl = document.getElementById('girlName').value;
        }
        const title = document.querySelector('title')
        title.innerHTML = `${boy}和${girl}的浪漫表白`;
        change.innerHTML = "修改";
    }
    else {
        alert('请输入男生和女生的名字');
    }
    // btn.style.display="none"
})