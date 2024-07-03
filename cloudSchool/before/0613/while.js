var arr = [];
var i=1
while(i<10){
    arr.push("2 * " + i + " = " + 2*i);
    i++
}

var i=0
while(i<arr.length){
    console.log(arr[i]);
    i++
    if(i==5) break;
}

console.log("==============================");

var i=0
while(i<arr.length){
    if(i==5){
        i++
        continue;}
    console.log(arr[i]);
    i++;
}
alert();

