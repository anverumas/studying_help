const element = document.querySelector('.textField'); 
const class_add = document.querySelector('#class_add'); 
const mark_add = document.querySelector('#mark_add'); 
const contentSy = document.querySelector('.textContent'); 
let timesMarkAdd = 0; 
let timesClassAdd = 0; 
function addMarkField() { 
  element.innerHTML += 
    '<select name="marks" id="mark_fld"><option value=" "></option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">MA</option></select>'; 
} 
function addOptionsToAllRows() { 
  const allInputs = document.querySelectorAll('.textField input'); 
  allInputs.forEach((input) => { 
    { 
      const select = document.createElement('select'); 
      select.innerHTML = 
        '<select name="marks" id="mark_fld"><option value=" "></option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">MA</option></select>'; 
      input.after(select); 
    } 
  }); 
}; 
class_add.addEventListener('click', function (event) { 
  console.log('Key pressed: ${event.key}'); 
  console.log('User input: ${event.target.value}'); 
  const row = document.createElement('div');
row.className = 'row';
row.innerHTML = '<input />';
element.appendChild(row);
  timesClassAdd += 1; 
  for (let i = 0; i < timesMarkAdd + 1; i++) { 
    addMarkField(); 
  } 
}); 
mark_add.addEventListener('click', function (event) { 
  console.log('User input: ${event.target.value}'); 
  addOptionsToAllRows(); 
  timesMarkAdd += 1; 
  calculateAverage(); 
  for (let i = 0; i < class_add + 1; i++) { 
    document.querySelector('.box').style.transform = 'translateY(-20px)'; 
    addOptionsToAllRows(); 
  } 
}); 

function calculateAverage() { 
  const rows = document.querySelectorAll('.textField'); // Каждая строка 
  rows.forEach((row) => { 
    const selects = row.querySelectorAll('select'); // Все селекты в строке 
    let total = 0; 
    let count = 0; 
 
    // Пробегаемся по каждому селекту в строке 
    selects.forEach((select) => { 
      const value = parseInt(select.value); // Получаем значение из селекта 
      if (!isNaN(value)) { 
        total += value; 
        count++; 
      } 
    }); 
 
    const average = count > 0 ? (total / count).toFixed(2) : 0; 
 
    // Добавляем/обновляем отображение среднего 
    let averageDisplay = row.querySelector('.average'); 
    if (!averageDisplay) { 
      averageDisplay = document.createElement('span'); 
      averageDisplay.className = 'average'; 
      row.appendChild(averageDisplay); 
    } 
    averageDisplay.textContent = `avg:${average}`; 
  }); 
} 
addMarkField()
setInterval(calculateAverage, 3000); 