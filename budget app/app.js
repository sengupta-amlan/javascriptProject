
//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    

    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    //to add method we add to proto
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(cur=>{
            sum=sum+cur.value;
        })
        data.totals[type]=sum;
    };

    var data={
        allItems:{
            exp:[],
            inc:[],
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };

    return {
        addItem:function(type,des,val){
            var newItem,ID;
            
            //new ID
            if(data.allItems[type].length>0){
                ID=data.allItems[type][data.allItems[type].length-1].id +1;
            }
            else{
                ID=0;
            }
            

            //new ITEM based on INC or EXP
            if(type==='exp'){
                newItem= new Expense(ID,des,val);
            }
            else if(type==='inc'){
                newItem= new Income(ID,des,val);
            }
           
            data.allItems[type].push(newItem);
            return newItem;
        },

        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        

        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            
            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },

        
        calculatePercentages: function() {
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        getBudget:function(){
            return{
                
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage

            }
        }        
    };

})();



//UI CONTROLLER
var UIController=(function(){
    //to get the input
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContianer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel: '.item__percentage',
    };

    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };


    return{
        getInput: function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem:function(obj,type){
            // create a html string with a placeholder text
            var html,newHtml,element;
            if(type==='inc'){
                element=DOMstrings.incomeContianer;
                html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else if(type==='exp'){
                element=DOMstrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }            
           
            console.log(obj);
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //insert html to the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },

        clearFields:function(){
            var fields;

            fields=document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            
            fieldsArr.forEach(function(current) {
                current.value = "";
            });

            //using the method below we set the focus on the descripton tag
            fieldsArr[0].focus();

        },

        displayBudget:function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent=obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent =obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent =obj.totalExp;
            
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },


        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();






//GLOBAL APP CONTROLLER
var controller=(function(budgetCtrl,UICtrl){

    var setupEventListeners=function(){
        var DOM=UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 ){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var updateBudget=function(){
      // calculate the budget
        budgetCtrl.calculateBudget();
      // display the budget on the UI
        var budget=budgetCtrl.getBudget();
      // return the budjet
      // console.log(budget);
      UICtrl.displayBudget(budget);
    }

    
    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };
    

    var ctrlAddItem=function(){
      // get the filled input data

    var input,newItem;
    input=UICtrl.getInput();
        
    if(input.description !=="" && !isNaN(input.value) && input.value>0){
         // add the item to budget controller
    newItem=budgetCtrl.addItem(input.type,input.description,input.value);
      
        //clear the fields

    UICtrl.clearFields();
        
        // add the new item to the user interface
    UICtrl.addListItem(newItem,input.type);

        //calculate and update budjet
    updateBudget();
        //Calculate and update percentages
    updatePercentages();


        }
     
    };

    var ctrlDeleteItem=function(event){

        var itemID,splitID, type, ID;
        
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if(itemID){
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init:function(){
            console.log('App started');
            UICtrl.displayBudget(  
            {   budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
  
})(budgetController,UIController);

controller.init();