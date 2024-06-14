var msg = {
    name : 'fire man',
    comment : 'never give up',
    age : 19
}

var msg2 = new Object();
msg2 = {
    name : 'fire man',
    comment : 'never give up',
    age : 19
}

var arr = [];
arr.push(msg);
arr.push(msg);

msg.age = 20

console.log(arr)