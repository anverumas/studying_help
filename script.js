const element = document.querySelector('.textField'); 
const class_add = document.querySelector('#class_add'); 
let timesClassAdd = 0; 
const all_Marks =`
    <option value=" "></option>
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
  `

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
      } else {
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
  });


  element.appendChild(row);

  timesClassAdd += 1;
  let markSelect = document.createElement('select');
  markSelect.className = 'mark';
  markSelect.innerHTML = all_Marks;
  row.appendChild(markSelect);
  attachMarkChangeHandler(markSelect, row);

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

}
function attachMarkChangeHandler(select, row) {
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

function addMarkField(row, subjectId, grade, markId) {
  const select = row.querySelector(':scope > select.mark');
  if (!select) {
    return;
  }
  select.value = grade ?? ' ';
  if (markId !== undefined) {
    select.dataset.markId = markId;
  }
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
})
  })
  .catch(error => {
    console.log('Loading error:', error);
    
});

class_add.addEventListener('click', function () {
  addClassField('');
});