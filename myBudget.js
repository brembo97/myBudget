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
        },
        budget: 0,
        percentage: -1
    }

    var calcTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach((x) => sum += x.value);
        data.totals[type] = sum;
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
        calcBudget:function(){
            //calculates the totals
            calcTotal("inc");
            calcTotal("exp");
            //caculates the budget
            data.budget = data.totals.inc - data.totals.exp
            //calculates the income percentage
            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },
        deleteItem:function(type, ID){
            var idsArr, index;
            //create array of indexes
            idsArr = data.allItems[type].map(function(current){
                return current.id;
            });
            index = idsArr.indexOf(ID);
            //delete item from item list
            data.allItems[type].splice(index, 1);
        },
        getBudget:function(){
            return{
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data);
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
        incList: ".inc_list",
        budget: ".budget_amount",
        budInc: ".budget_income_amount",
        budExp: ".budget_expenses_amount",
        budExpPer: ".budget_expenses_percentage",
        container: ".container"
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
        updateBud: function(obj){
            var sign;
            obj.budget > 0 ? sign = " + " : sign = "";
            document.querySelector(DOMStrings.budget).textContent = sign + obj.budget;
            document.querySelector(DOMStrings.budInc).textContent = obj.totalInc;
            document.querySelector(DOMStrings.budExp).textContent = obj.totalExp;
            if(obj.percentage > 0 )
                document.querySelector(DOMStrings.budExpPer).textContent = obj.percentage + "%";
            else
                document.querySelector(DOMStrings.budExpPer).textContent = "--";
        },
        addListItem: function(obj, type){

            var html, newHtml, element;
            //Generate the html
             if(type === "inc"){
                element = document.querySelector(DOMStrings.incList);
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                '</div> </div></div>';
             }else if(type === "exp"){
                element = document.querySelector(DOMStrings.expList);
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'+
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
        },
        deleteItem: function(selectorID){
            document.getElementById(selectorID).remove();
        }
    }
})()

//GLOBAL CONTROLLER
var Controller = (function(budCtrl,uiCtrl){

    var setUpEventListeners = function(){
 
         var DOM = uiCtrl.getDOMStrings();
        
        document.querySelector(DOM.stringBtn).addEventListener("click", updateCtrl);
        document.querySelector(DOM.container).addEventListener("click",ctrDelItem);

        document.addEventListener("keypress", function(e){
        
            if(e.keyCode === 13 || e.which === 13){
                updateCtrl();
            }
        })
    }

    function calcBudget(){
        //Calculate new budget
        budCtrl.calcBudget();
        //Return budget
        var budget = budCtrl.getBudget()
        //Update the budget in the UI
        uiCtrl.updateBud(budget);
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
            //Caculate Budget
            calcBudget()
        }
    }

    var ctrDelItem = function(event){
        var itemID, arrID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            //Get the item info
            arrID = itemID.split("-");
            type = arrID[0];
            ID = parseInt(arrID[1]);
            //Delete item from the budget data structure
            budCtrl.deleteItem(type, ID);
            //Delete item from the UI
            uiCtrl.deleteItem(itemID);
            //Recalculate and display budget
            
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