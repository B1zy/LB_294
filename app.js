document.addEventListener('DOMContentLoaded', function() {
  fetch('WebAPI.json')
      .then(response => response.json())
      .then(data => {
          const diaryContainer = document.getElementById('diary-container');
          data.entries.forEach(entry => {
              const entryDiv = document.createElement('div');
              const entryTitle = document.createElement('span');
              const viewButton = document.createElement('button');

              entryTitle.textContent = entry.title;
              viewButton.textContent = 'View Details';
              viewButton.onclick = () => displayDetails(entry);

              entryDiv.appendChild(entryTitle);
              entryDiv.appendChild(viewButton);
              diaryContainer.appendChild(entryDiv);
              
          });
      })
      
      .catch(error => console.error('Error loading diary entries:', error));
});

function displayDetails(entry) {
  const detailsContainer = document.getElementById('details-container');
  if (!detailsContainer) {
      console.error('Details container not found in the HTML');
      return;
  }

  // Clear existing content
  detailsContainer.innerHTML = '';

  // Create and append new content for the selected entry
  const titleElement = document.createElement('h3');
  titleElement.textContent = entry.title;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = entry.description;

  const authorElement = document.createElement('p');
  authorElement.textContent = 'Author: ' + entry.author;

  const contentElement = document.createElement('p');
  contentElement.textContent = entry.content;

  const creationDateElement = document.createElement('p');
  creationDateElement.textContent = 'Created on: ' + entry.creationDate + ' at ' + entry.creationHour;

  detailsContainer.appendChild(titleElement);
  detailsContainer.appendChild(descriptionElement);
  detailsContainer.appendChild(authorElement);
  detailsContainer.appendChild(contentElement);
  detailsContainer.appendChild(creationDateElement);
}
document.addEventListener('DOMContentLoaded', function() {
  // Existing code to load diary entries...

  const newEntryButton = document.getElementById('new-entry-button');
  newEntryButton.onclick = () => showNewEntryForm();
});

function showNewEntryForm() {
  const formContainer = document.getElementById('new-entry-form');
  if (!formContainer) {
      console.error('New entry form container not found in the HTML');
      return;
  }

  // Clear existing content and display the form
  formContainer.innerHTML = '';
  formContainer.style.display = 'block';

  const form = document.createElement('form');
  form.id = 'entry-form';
  form.innerHTML = `
  <input type="text" id="new-title" placeholder="Title">
  <input type="text" id="new-author" placeholder="Author">
  <textarea id="new-content" placeholder="Content"></textarea>
  <button type="button" onclick="addNewEntry()">Submit</button>
  `;
  formContainer.appendChild(form);
}

function addNewEntry() {
  const title = document.getElementById('new-title').value;
  const author = document.getElementById('new-author').value;
  const content = document.getElementById('new-content').value;
  const creationDate = new Date().toLocaleDateString(); // Format: 'MM/DD/YYYY'
  const creationTime = new Date().toLocaleTimeString(); // Format: 'HH:MM:SS AM/PM'


  const newEntry = {
    title,
    author,
    content,
    creationDate,
    creationHour: creationTime,
    // Add any other necessary fields here
};

// Send the new entry to the backend
fetch('http://localhost:2940/api/v1/entities', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEntry)
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to create new entry');
    }
})
.then(data => {
    console.log('New entry created:', data);
    // Optionally, update the UI to include the new entry
    appendNewEntryToUI(data);
})
.catch(error => console.error('Error creating new entry:', error));

// Hide the form after submission
document.getElementById('new-entry-form').style.display = 'none';

}
function appendNewEntryToUI(entry) {
  const diaryContainer = document.getElementById('diary-container');
  const entryDiv = document.createElement('div');
  const entryTitle = document.createElement('span');
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => editEntry(entry, entryDiv);

  entryTitle.textContent = entry.title;

  const viewButton = document.createElement('button');
  viewButton.textContent = 'View Details';
  viewButton.onclick = () => displayDetails(entry);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => deleteEntry(entry, entryDiv);

  entryDiv.appendChild(entryTitle);
  entryDiv.appendChild(viewButton);
  entryDiv.appendChild(deleteButton); // Add the delete button
  entryDiv.appendChild(editButton);
  diaryContainer.appendChild(entryDiv);
}
function deleteEntry(entry, entryDiv) {
  // Here you would send a request to your backend to delete the entry
   fetch('http://localhost:2940/api/v1/entities', { method: 'DELETE', body: JSON.stringify({ id: entry.id }) });

  // Remove the entry from the UI
  entryDiv.remove();
}
function editEntry(entry, entryDiv) {
  entryDiv.innerHTML = '';
  
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = entry.title;
  titleInput.id = `edit-title-${entry.id}`;

  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.value = entry.author;
  authorInput.id = `edit-author-${entry.id}`;

  const contentTextarea = document.createElement('textarea');
  contentTextarea.value = entry.content;
  contentTextarea.id = `edit-content-${entry.id}`;

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.onclick = () => submitEdit(entry.id, entryDiv, titleInput, authorInput, contentTextarea);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = () => cancelEdit(entry.id, entryDiv, entry);

  entryDiv.appendChild(titleInput);
  entryDiv.appendChild(authorInput);
  entryDiv.appendChild(contentTextarea);
  entryDiv.appendChild(saveButton);
  entryDiv.appendChild(cancelButton);
}

function submitEdit(entryId, entryDiv, titleInput, authorInput, contentTextarea) {
  const editedTitle = titleInput.value;
  const editedAuthor = authorInput.value;
  const editedContent = contentTextarea.value;

  const updatedEntry = {
      id: entryId,
      title: editedTitle,
      author: editedAuthor,
      content: editedContent,
      // ...other fields if necessary...
  };

  // ...send request to backend and handle response...

  updateEntryDisplay(entryDiv, updatedEntry);
}
function cancelEdit(entryId, entryDiv, originalEntry) {
  // Restore the original display of the entry
  updateEntryDisplay(entryDiv, originalEntry);
}
function updateEntryDisplay(entryDiv, entry) {
  entryDiv.innerHTML = '';

  const entryTitle = document.createElement('span');
  entryTitle.textContent = entry.title;

  const viewButton = document.createElement('button');
  viewButton.textContent = 'View Details';
  viewButton.onclick = () => displayDetails(entry);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => editEntry(entry, entryDiv);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => deleteEntry(entry, entryDiv);

  entryDiv.appendChild(entryTitle);
  entryDiv.appendChild(viewButton);
  entryDiv.appendChild(editButton);
  entryDiv.appendChild(deleteButton);
}