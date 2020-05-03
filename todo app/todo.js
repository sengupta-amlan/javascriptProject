const addForm=document.querySelector('.add');
const addIcon=document.querySelector('.addIcon');
const search=document.querySelector('.search input');

const list=document.querySelector('.todos');

const enter=function(){
   
    const todo=addForm.add.value.trim();
    if(todo.length){
        generateTemplate(todo);
        addForm.reset();
    }
}

const generateTemplate=(todo)=>{
    const html=`
    <li class="list-group-item d-flex justify-content-between text-align-center">
        <span>${todo}</span>
        <i class="far fa-trash-alt delete"></i>
    </li>
    `
    list.innerHTML+=html;
}

addForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    enter();
})

addIcon.addEventListener('click',(e)=>{
    e.preventDefault();
    enter();
})


//delete
list.addEventListener('click',e=>{
    if(e.target.classList.contains('delete')){
        e.target.parentElement.remove();
    }
})

//search and filter
const filterTodos=(term)=>{
    Array.from(list.children)
        .filter((todo)=>!todo.textContent.includes(term))
        .forEach((todo)=>todo.classList.add('filtered'))

    Array.from(list.children)
        .filter((todo)=>todo.textContent.includes(term))
        .forEach((todo)=>todo.classList.remove('filtered'))
};



search.addEventListener('keyup',()=>{
    const term=search.value.trim();
    filterTodos(term);
})