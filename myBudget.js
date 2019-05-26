//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems:{
            inc: [],
            exp: []
        },
        totals:{
            inc: 0,
            exp: 0
        }
    }

    return{
        createItem:function(type, des, val){
            var newItem, ID;

            //Set the id for the new item
            if(data.allItems[type].length <= 0)
                ID = 0;
            else
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            //Create the new item
            if(type === "exp")
                newItem = new Expenses(ID, des, val);
            else if(type === "inc")
                newItem = new Income(ID, des, val);

            //Add the item to the data structure
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function(){
            console.log(data.allItems);
        }
    }

})()

//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        stringSel: ".add_select",
        stringDes: ".add_description",
        stringAmo: ".add_value",
        stringBtn: ".add_button"
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.stringSel).value, // returns inc or exp
                description: document.querySelector(DOMStrings.stringDes).value,
                value: document.querySelector(DOMStrings.stringAmo).value,
                button: document.querySelector(DOMStrings.stringBtn).value
            }
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    }
})()

//GLOBAL CONTROLLER
var Controller = (function(budCtrl,uiCtrl){

    var setUpEventListeners = function(){
 
         var DOM = uiCtrl.getDOMStrings();
        
        document.querySelector(DOM.stringBtn).addEventListener("click", updateCtrl);

        document.addEventListener("keypress", function(e){
        
            if(e.keyCode === 13 || e.which === 13){
                updateCtrl();
            }
        })
    }

    function updateCtrl(){

        //Get value from input fields
        var input = uiCtrl.getInput();
        //Add item to budget controller
        budCtrl.createItem(input.type, input.description, input.value);
        //Display item in the UI

        //Calculate new budget

        //Update the budget in the UI

    }

    return{
        init: function(){
            console.log("Application has started");
            setUpEventListeners();
        }
    }

})(budgetController,UIController);

Controller.init();