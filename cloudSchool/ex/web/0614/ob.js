let dic = new Object();

dic.boy = "bobobo";
dic.girl = "gigigi";
dic.fuc = function(weapon){
    return `${weapon}으로 공격한다.`
}

// console.log(dic.fuc('주먹'));
console.log(dic['boy']);
