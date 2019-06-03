//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    Expenses.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0)
            this.percentage = Math.round((this.value/totalIncome)*100);
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
        calcAllPercentages: function(){
            data.allItems.exp.forEach( (exp) => {
                exp.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var percentages = data.allItems.exp.map(function(cur){
                return cur.percentage;
            })
            return percentages;
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
        container: ".container",
        expPerLabel: ".item__percentage",
        dateLabel: ".budget_title"
    }

    var formatNumbers = function(num, type){
        var int, decimal;

        num = Math.abs(num);
        num = num.toFixed(2);

        int = num.split(".")[0];
        decimal = num.split(".")[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }

        return (type === "exp" ? " - " : " + ") + int + "." + decimal;
    }

    
    var nodeListFunc = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
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
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMStrings.budget).textContent = formatNumbers(obj.budget, type);
            document.querySelector(DOMStrings.budInc).textContent = formatNumbers(obj.totalInc, "inc");
            document.querySelector(DOMStrings.budExp).textContent = formatNumbers(obj.totalExp, "exp");
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
                 '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">--</div>'+
                 '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>'+
                 '</div></div>';
             }
             //Replace placeholder text with actual input
             newHtml = html.replace("%id%",obj.id);
             newHtml = newHtml.replace("%description%",obj.description);
             newHtml = newHtml.replace("%value%", formatNumbers(obj.value, type));
    
             //Insert item into the UI
            element.insertAdjacentHTML("beforeend",newHtml);
        },
        deleteItem: function(selectorID){
            document.getElementById(selectorID).remove();
        },
        displayPercentages: function(percentages){

            fields = document.querySelectorAll(DOMStrings.expPerLabel);
            
            nodeListFunc(fields, function(current, index){
                if(percentages[index] > 0)
                    current.textContent = percentages[index] + "%";
                else
                    current.textContent = "--";
            });
        },
        displayDate: function(){
            var now, month, months, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMStrings.dateLabel).textContent = "Available budget of " + months[month] + " " + year;
        },
        changeInputColors: function(){
            var inputs;

            inputs = document.querySelectorAll(
                DOMStrings.stringSel + "," +
                DOMStrings.stringDes + "," +
                DOMStrings.stringAmo
            )

            nodeListFunc(inputs, function(el){
                el.classList.toggle("red-focus");
            });

            document.querySelector(DOMStrings.stringBtn).classList.toggle("red");
        }
    }
})()

//GLOBAL CONTROLLER
var Controller = (function(budCtrl,uiCtrl){

    var setUpEventListeners = function(){
 
         var DOM = uiCtrl.getDOMStrings();
        
        document.querySelector(DOM.stringBtn).addEventListener("click", ctrlAddItem);
        document.querySelector(DOM.container).addEventListener("click",ctrDelItem);

        document.addEventListener("keypress", function(e){
        
            if(e.keyCode === 13 || e.which === 13){
             ctrlAddItem();
            }
        })

        document.querySelector(DOM.stringSel).addEventListener("change", uiCtrl.changeInputColors);
    }

    var updateBudget = function(){
        //Calculate new budget
        budCtrl.calcBudget();
        //Return budget
        var budget = budCtrl.getBudget()
        //Update the budget in the UI
        uiCtrl.updateBud(budget);
    } 

    var updatePercentages = function(){

        //Calculate the percentages
        budCtrl.calcAllPercentages();
        // Get percentages
        var percentages = budCtrl.getPercentages();
        //Display the percentages
        uiCtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function(){

        //Get value from input fields
        var input = uiCtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //Add item to budget controller
            var newItem = budCtrl.createItem(input.type, input.description, input.value);
            //Display item in the UI
            uiCtrl.addListItem(newItem, input.type);
            //Reset input value
            uiCtrl.resetValues();
            //Update Budget
            updateBudget();
            //Update Percentages
            updatePercentages();
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
            updateBudget();
            //Update Percentages
            updatePercentages();
        }
    }

    return{
        init: function(){
            console.log("Application has started");
            uiCtrl.displayDate();
            uiCtrl.updateBud({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1
            })
            setUpEventListeners();
        }
    }

})(budgetController,UIController);

Controller.init();