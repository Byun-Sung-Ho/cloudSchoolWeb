const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

//callback function
function reset(ch){
    switch(ch){
        case 'y':
            console.log("delete success");
            break;
        case 'n':
            console.log("delete fail");
            break;
        default:
            console.log("invaild word");
            break;
    }
    rl.close();
}

rl.question('c drive reset(y or n)', reset)