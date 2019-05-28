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
        }
    }

})()

//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        stringSel: ".add_select",
        stringDes: ".add_description",
        stringAmo: ".add_value",
        stringBtn: ".add_button",
        expList: ".exp_list",
        incList: ".inc_list"
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.stringSel).value, // returns inc or exp
                description: document.querySelector(DOMStrings.stringDes).value,
                value: parseFloat(document.querySelector(DOMStrings.stringAmo).value),
                button: document.querySelector(DOMStrings.stringBtn).value
            }
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        resetValues:function(){
            var fields, fieldsArr;

           fields = document.querySelectorAll(DOMStrings.stringDes + "," + DOMStrings.stringAmo);

           fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach( (cur) => {
                cur.value = "";
            });

            fieldsArr[0].focus();
        },
        addListItem: function(obj, type){

            var html, newHtml, element;
            //Generate the html
             if(type === "inc"){
                element = document.querySelector(DOMStrings.incList);
                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                '</div> </div></div>';
             }else if(type === "exp"){
                element = document.querySelector(DOMStrings.expList);
                 html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div>'+
                 '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>'+
                 '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>'+
                 '</div></div>';
             }
             //Replace placeholder text with actual input
             newHtml = html.replace("%id%",obj.id);
             newHtml = newHtml.replace("%description%",obj.description);
             newHtml = newHtml.replace("%value%",obj.value);
    
             //Insert item into the UI
            element.insertAdjacentHTML("beforeend",newHtml);
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

    function calcBudget(){
        //Calculate new budget

        //Return budget

        //Update the budget in the UI
    } 

    function updateCtrl(){

        //Get value from input fields
        var input = uiCtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //Add item to budget controller
            var newItem = budCtrl.createItem(input.type, input.description, input.value);
            //Display item in the UI
            uiCtrl.addListItem(newItem, input.type);
            //Reset input value
            uiCtrl.resetValues();
        }
    }

    return{
        init: function(){
            console.log("Application has started");
            setUpEventListeners();
        }
    }

})(budgetController,UIController);

Controller.init();