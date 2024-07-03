let obj = {
    myVar : "foo",
    myFunc : function(){
        let self = this;
        console.log(this.myVar);

        setTimeout(function(){
            console.log(self.myVar)
        },1000)
    }
}

let obj2 = {
    myVar : "foo",
    myFunc : function(){
        let self = this;
        console.log(this.myVar);

        setTimeout(function(){
            console.log(this.myVar)
        }.bind(this), 1000)
    }
}

let obj3 = {
    myVar : "foo",
    myFunc : function(){
        let self = this;
        console.log(this.myVar);

        setTimeout(
            () => {
            console.log(this.myVar)
        }, 1000)
    }
}

let obj4 = {
    myVar : "foo",
    myFunc : ()=>{
        let self = this;
        console.log(this.myVar);

        setTimeout(
            () => {
            console.log(this.myVar)
        }, 1000)
    }
}

obj2.myFunc();