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
  row.dataset.subjectId = subjectId;
  row.innerHTML = '<input />';
  const input = row.querySelector('input');
  input.value = subjectName ?? '';
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const name = input.value.trim();

    if (subjectId !== undefined) {
  fetch(`/subjects/${subjectId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: name })
})
.then(response => {
  if (response.status === 200) {
  console.log('Subject updated');
  } else {
        console.log('Failed to update subject');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
} 

else {
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
        response.json().then(data => {
        subjectId = data.id;
        row.dataset.subjectId = data.id;
});
      } else {
        console.log('Failed to save subject');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }
}
    
  })


  element.appendChild(row);

  timesClassAdd += 1;
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
      fetch(`/subjects/${subjectId}`, {
  method: 'DELETE'
})
.then(response => {
  if (response.status === 200) {
    row.remove();
  }
});
  });

  equalizeMarkFields();

}
function addMarkField(row, subjectId, grade, markId) {
  const select = document.createElement('select');
  select.innerHTML = all_Marks;
  select.value = grade;
  if (markId !== undefined) {
    select.dataset.markId = markId;
  }
  const average = row.querySelector('.average');
  row.insertBefore(select, average);;
  select.addEventListener('change', function(event) {
  const grade = parseInt(event.target.value);
  if (!Number.isInteger(grade)) {
    return;
  }

  const associatedSubjectId = parseInt(row.dataset.subjectId);
  if (!Number.isInteger(associatedSubjectId)) {
    console.log('Save the subject before adding a mark');
    return;
  }

  const existingMarkId = select.dataset.markId;
  const updatingMark = existingMarkId !== undefined;

  fetch(updatingMark ? `/marks/${existingMarkId}` : '/marks', {
  method: updatingMark ? 'PUT' : 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
  subject_id: associatedSubjectId,
  grade: grade
})
})
.then(response => {
  if (updatingMark && response.status === 200) {
    console.log('Mark updated');
  } else if (!updatingMark && response.status === 201) {
    console.log('Mark saved');
    return response.json().then(data => {
      select.dataset.markId = data.id;
    });
  } else {
    console.log(updatingMark ? 'Failed to update mark' : 'Failed to save mark');
  }
})
.catch(error => {
  console.log('Error:', error);
});
});
}



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
  const rows = document.querySelectorAll('.row');

rows.forEach((row) => {
  addMarkField(row, parseInt(row.dataset.subjectId));
});
  calculateAverage(); 
}); 

function equalizeMarkFields() {
  const rows = document.querySelectorAll('.row');
  const markCount = Math.max(0, ...Array.from(rows, (row) =>
    row.querySelectorAll('select:not(.finalGrade)').length
  ));

  rows.forEach((row) => {
    const rowMarkCount = row.querySelectorAll('select:not(.finalGrade)').length;
    for (let i = rowMarkCount; i < markCount; i++) {
      addMarkField(row, parseInt(row.dataset.subjectId));
    }
  });
}

fetch('/subjects')
  .then(response => response.json())
  .then(subjects => {
    subjects.forEach(subject => {
      addClassField(subject.name, subject.id);
    });
    return fetch('/marks')
  .then(response => response.json())
.then(marks => {
  const rows = document.querySelectorAll('.row');
  marks.forEach((mark) => {
  rows.forEach((row) => {
    if (parseInt(row.dataset.subjectId) === mark.subject_id) {
      addMarkField(row, mark.subject_id, mark.grade, mark.id);
    }
  });
});
    equalizeMarkFields();
})
  })
  .catch(error => {
    console.log('Loading error:', error);
    
});


setInterval(calculateAverage, 500); 