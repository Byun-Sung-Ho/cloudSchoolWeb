loginBtn.addEventListener('click', function(){
    var id = document.getElementById('Id').value;
    var name = document.getElementById('Name').value;
    var pw = document.getElementById('pw').value;
    
    if(id == ""){
        alert('id를 입력해주세요')
    }
    else if(pw == ""){
        alert('pw를 입력해주세요')
    }
    else if(name == ""){
        alert('name을 입력해주세요')
    }
    else{
        alert(`NAME : ${name}, ID : ${id}, PW : ${pw}`);
    }
})