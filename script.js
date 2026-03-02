let tasksdata={
}
const todo=document.querySelector('#todo');
const progress=document.querySelector('#progress');
const done=document.querySelector('#done');
const columns=[todo,progress,done];

const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.modal .bg');
const modalCenter = document.querySelector('.modal .center');
const toggleModalButton = document.querySelector('#toggle-modal');
const addTaskButton = document.querySelector('#add-new-task');
const taskTitleInput = document.querySelector('#task-title-input');
const taskDescInput = document.querySelector('#task-desc-input');


let dragElement=null;

function addTask(title,desc,column){
    const div=document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable","true");

  const heading = document.createElement('h2');
  heading.innerText = title;

  const description = document.createElement('p');
  description.innerText = desc;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.innerText = 'Delete';

  div.append(heading, description, deleteButton);

    column.appendChild(div);

    // attach drag handlers for the new task
    div.addEventListener('dragstart', () => { dragElement = div; });
    div.addEventListener('dragend', () => { dragElement = null; });

    deleteButton.addEventListener('click', () => {
        div.remove();
        updateTaskCount();
    });

} 

function updateTaskCount(){
    columns.forEach(col=>{
            const tasks=col.querySelectorAll(".task");
            const count=col.querySelector(".right");
            tasksdata[col.id]=Array.from(tasks).map(t=>{
                return{
                    title:t.querySelector("h2").innerText,
                    desc:t.querySelector("p").innerText
                }
            })
            localStorage.setItem("tasks", JSON.stringify(tasksdata));

            if (count) count.innerText = tasks.length; 
        })
}


if (localStorage.getItem("tasks")) {
  try {
    const data = JSON.parse(localStorage.getItem("tasks"));
    for (const col in data) {
      const column = document.querySelector(`#${col}`);
      if (!column) {
        continue;
      }
      data[col].forEach(task => {
        addTask(task.title, task.desc, column);
      });
    }
    updateTaskCount();
  } catch (err) {
    localStorage.removeItem('tasks');
  }
} 


// Select all tasks (querySelectorAll returns a NodeList)
const tasks = document.querySelectorAll('.task');

tasks.forEach(task => {
    task.setAttribute('draggable', 'true');
    task.addEventListener('dragstart', () => { dragElement = task; });
    task.addEventListener('dragend', () => { dragElement = null; });
}); 

function addDragEventsOnColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover",(e)=>{
        e.preventDefault();
    })

    column.addEventListener("drop",(e)=>{
        e.preventDefault();
   
        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateTaskCount();
    })
};

[todo, progress, done].forEach(col => {
  if (col) addDragEventsOnColumn(col);
}); 

function closeModal() {
  if (!modal) return;
  modal.classList.remove('active');
  if (toggleModalButton) toggleModalButton.focus();
}

function openModal() {
  if (!modal) return;
  modal.classList.add('active');
  if (taskTitleInput) taskTitleInput.focus();
}

if (toggleModalButton && modal) {
  toggleModalButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (modal.classList.contains('active')) {
      closeModal();
      return;
    }
    openModal();
  });
}

// close only when clicking the background overlay (not when clicking inside .center)
if (modalBg && modal) {
  modalBg.addEventListener('click', (e) => {
    closeModal();
  });
}

if (modalCenter) {
  modalCenter.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeModal();
  }
});

if (addTaskButton && modal) {
  addTaskButton.addEventListener('click', () => {
    if (!taskTitleInput || !taskDescInput) return;

    const taskTitle = taskTitleInput.value.trim();
    const taskDesc = taskDescInput.value.trim();
    if (!taskTitle) {
      alert('Please enter a task title');
      return;
    }
    addTask(taskTitle, taskDesc, todo);

    updateTaskCount();

    closeModal();

    taskTitleInput.value = '';
    taskDescInput.value = '';
  });
}

