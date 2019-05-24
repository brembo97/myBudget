var budgetController = (function(){
     
    var x = 20;

    function add(y){
        return x + y;
    }

    return {
        printScore: function(z){
            return(add(z));
        }
    }
})()

var UIController = (function(){

    return{
        
    }

})()

var Controller = (function(budCnt,uiCnt){

    return{
    
    }


})(budgetController,UIController)