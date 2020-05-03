
//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
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