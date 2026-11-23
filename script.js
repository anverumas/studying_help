const element = document.querySelector('.textField'); 
const class_add = document.querySelector('#class_add'); 
const mark_add = document.querySelector('#mark_add'); 
const contentSy = document.querySelector('.textContent'); 
let timesMarkAdd = 0; 
let timesClassAdd = 0; 
const all_Marks =`
    <option value=" "></option>
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
    <option value="1">MA</option>
  `

function calculateAverage() { 
  const mark = document.querySelectorAll('.row');
  mark.forEach((row) => { 
    const selects = row.querySelectorAll('select:not(.finalGrade)');
    let total = 0; 
    let count = 0; 

    selects.forEach((select) => { 
      const value = parseInt(select.value); // Получаем значение из селекта 
      if (!isNaN(value)) { 
        total += value; 
        count++; 
      } 
    }); 
 
    const average = count > 0 ? (total / count).toFixed(2) : 0; 
    let averageDisplay = row.querySelector('.average'); 
    averageDisplay.textContent = `avg:${average}`; 
  }); 
} 



function addClassField(subjectName, subjectId) { 
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = '<input />';
  const input = row.querySelector('input');
  input.value = subjectName ?? '';
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const name = input.value.trim();

    fetch('/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name })
    })
    .then(response => {
      if (response.status === 201) {
        console.log('Subject saved');
      } else {
        console.log('Failed to save subject');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }
});
  element.appendChild(row);

  timesClassAdd += 1; 
  for (let i = 0; i < timesMarkAdd + 1; i++) { 
    addMarkField(row); 
  } 
  let averageDisplay = document.createElement('span');
  averageDisplay.className = 'average';
  row.appendChild(averageDisplay);

  let finalGrade = document.createElement('select');
  finalGrade.className = 'finalGrade';
  row.appendChild(finalGrade);
  finalGrade.innerHTML = all_Marks;

  let deleteButton = document.createElement('button');
  deleteButton.className = 'deleteButton';
  row.appendChild(deleteButton);
  deleteButton.textContent = 'X';
  deleteButton.addEventListener('click', function () {
    row.remove();
  });
}; 



function addMarkField(row) {
  const select = document.createElement('select');
  select.innerHTML = all_Marks;
  row.appendChild(select);}



function addOptionsToAllRows() { 
  const allInputs = document.querySelectorAll('.textField input');
    timesMarkAdd += 1;  
  allInputs.forEach((input) => { 
    { 
      const select = document.createElement('select'); 
      select.innerHTML = all_Marks; 
      input.after(select); 
    } 
  }); 
}; 

class_add.addEventListener('click', function (event) { 
  console.log('Key pressed: ${event.key}'); 
  console.log('User input: ${event.target.value}'); 
  addClassField()
}); 

mark_add.addEventListener('click', function (event) { 
  console.log('User input: ${event.target.value}'); 
  addOptionsToAllRows(); 

  calculateAverage(); 
  for (let i = 0; i < class_add + 1; i++) { 
    document.querySelector('.box').style.transform = 'translateY(-20px)'; 
    addOptionsToAllRows(); 
  } 
}); 

fetch('/subjects')
  .then(response => response.json())
  .then(subjects => {
    subjects.forEach(subject => {
      addClassField(subject.name);
    });
  })
  .catch(error => {
    console.log('Loading error:', error);
  });

  fetch(`/subjects/${subjectId}`, {
  method: 'DELETE'
})
.then(response => {
  if (response.status === 200) {
    row.remove();
  }
});
setInterval(calculateAverage, 500); 