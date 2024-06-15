// function f(flag){
//     return new Promise((resolve,reject)=>{
//         if(flag){
//             serTimeOut(resolve, 3000);
//         }
//         else reject('처리 오류');
//     });
// }

// const prom = f(true);

// prom.then(function(value) {
//     console.log(value);    
// }).catch(
//     function(ermsg){
//         console.log(ermsg);
//     }
// )

function f(flag, time){
    return new Promise((resolve, reject) => {
        if(flag){
            setTimeout(resolve, time);
        }
        else{
            reject('처리 오류');
        }
    });
}

f(true, 3000)
.then(function() {
    console.log('a');
    return f(true, 2000);
})
.then(
    function(){
        console.log('b');
        return f(true, 1000);
    }
)
.then(
    function(){
        console.log('c');
    }
)
.catch(
    function(){
        console.log('d');
    }
);