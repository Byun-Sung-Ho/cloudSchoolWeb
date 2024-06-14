const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function checkNumber(number){
    if(number % 2){
        console.log('홀수');
    }
    else{
        console.log('짝수')
    }
    rl.close();
}

rl.question('input number : ', checkNumber)