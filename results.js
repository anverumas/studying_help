const resultsBody = document.querySelector('#results-body');

fetch('/results')
  .then(response => response.json())
  .then(results => {
    resultsBody.replaceChildren();

    results.forEach(result => {
      const row = document.createElement('tr');
      const subjectCell = document.createElement('td');
      const markCell = document.createElement('td');

      subjectCell.textContent = result.name;
      markCell.textContent = result.grade ?? '-';

      row.appendChild(subjectCell);
      row.appendChild(markCell);
      resultsBody.appendChild(row);
    });
  })
  .catch(error => {
    console.log('Loading results error:', error);
  });
