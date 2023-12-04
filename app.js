// Beispiel-JSON-Objekt
const jsonData = {
    "entries": [
    
        {"title" :"Eintrag eins",
        "id":"1",
        "description":"Mein erstes Eintrag",
        "author":"Autor:Kamil",
        "content":"Hey Tagebuch heute war 'n Tag. Morgenkaffee, Arbeit, bisschen Erfolg. Aber irgendwie fehlt was. Vielleicht mehr Action, weniger Langeweile? Ich denk drüber nach. Triffst Leute, sie haben ihre eigenen Deals. Das macht mich nachdenklich. Was will ich wirklich? Mehr Kick, mehr Spaß. Mal sehen, wie ich das hinbiegen kann. Schreib später mehr.",
        "creationDate":"Erstelldatum:04.12.2023",
        "creationHour":"12:00",
        "appendix":"false"
        },
        {"title" :"Eintrag zwei",
        "id":"2",
        "description":"Mein zweites Eintrag",
        "author":"Autor:Kamil",
        "content":"Moin Tagebuch, heute geht's um 'nen speziellen Kram. Einfach drauflos schreiben, ohne Filter. Mal gucken, was dabei rauskommt. Vielleicht 'ne Menge, vielleicht nicht viel. Aber hey, das ist das Spiel. bis dann, kamil",
        "creationDate":"Erstelldatum:05.12.2023",
        "creationHour":"13:00",
        "appendix":"false"
        },
        {"title" :"Eintrag drei",
        "id":"3", 
        "description":"Mein drittes Eintrag", 
        "author":"Autor:Kamil",
        "content": "Moin Tagebuch, heute brech' ich mal 'nen Unterschied runter. Kein Experten-Gelaber, nur meine Sicht. Keine Ahnung, ob's jemanden interessiert, aber es tut gut, es aufzuschreiben. Vielleicht klärt sich was in meinem Kopf, vielleicht nicht. Bis dann, kamil",
        "creationDate":"Erstelldatum:06.12.2023",
        "creationHour":"14:00",
        "appendix":"false"
        }
        
    ]
  };
  
// Fetch entries
fetch('http://localhost:3000/entries')
  .then(response => response.json())
  .then(entries => {
    // Handle the retrieved entries
    console.log(entries);
  })
  .catch(error => console.error('Error fetching entries:', error));

  
  
  // Funktion zum Anzeigen der Einträge
  function displayEntries(entries) {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = ''; // leeren Sie den Hauptbereich, um Aktualisierungen vorzunehmen
  
    entries.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.innerHTML = `<h2>${entry.title}</h2><p>${entry.description}</p><p>${entry.author}</p><p>${entry.creationDate}</p>`;
      
        // Detailansicht anzeigen Button hinzufügen
        const detailButton = document.createElement("button");
        detailButton.textContent = "Details anzeigen";
        detailButton.addEventListener("click", () => showDetailView(entry.id));

        // Bearbeiten- und Löschen-Buttons hinzufügen
        const editButton = document.createElement("button");
        editButton.textContent = "Bearbeiten";
        editButton.addEventListener("click", () => editEntry(entry.id));
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", () => deleteEntry(entry.id));

        entryDiv.appendChild(detailButton);
        entryDiv.appendChild(editButton);
        entryDiv.appendChild(deleteButton);
  
        mainContent.appendChild(entryDiv);
    });
}

  function showDetailView(entryId) {
    const entry = jsonData.entries.find(e => e.id === entryId);

    // Setzen Sie die Detailansicht mit den Daten des Eintrags
    document.getElementById("detailTitle").textContent = entry.title;
    document.getElementById("detailDescription").textContent = entry.description;
    document.getElementById("detailAuthor").textContent = entry.author;
    document.getElementById("detailContent").textContent = entry.content;
    document.getElementById("detailCreationDate").textContent = entry.creationDate;
    document.getElementById("detailCreationHour").textContent = entry.creationHour;

    // Formular und Hauptinhalt ausblenden, Detailansicht einblenden
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("editForm").style.display = "none";
    document.getElementById("detailView").style.display = "block";
}


// Funktion zum Zurückkehren zur Hauptansicht
function backToMain() {
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("detailView").style.display = "none";
  // Fügen Sie hier ggf. zusätzlichen Code hinzu, um die Detailansicht zurückzusetzen
}

  // Funktion zum Hinzufügen eines neuen Eintrags
  function addEntry(newEntry) {
    jsonData.entries.push(newEntry);
    displayEntries(jsonData.entries);
  }
  
 // Funktion zum Bearbeiten eines Eintrags
 function editEntry(entryId) {
  const entryToEdit = jsonData.entries.find(entry => entry.id === entryId);

  // Das Formular mit den Daten des zu bearbeitenden Eintrags vorfüllen
  document.getElementById("editTitle").value = entryToEdit.title;
  document.getElementById("editDescription").value = entryToEdit.description;
  document.getElementById("editContent").value = entryToEdit.content;
  document.getElementById("editAuthor").value = entryToEdit.author;
  document.getElementById("editCreationDate").value = entryToEdit.creationDate;
  document.getElementById("editCreationHour").value = entryToEdit.creationHour;
  document.getElementById("editAppendix").value = entryToEdit.appendix;

  // Setzen Sie die editId für den späteren Zugriff
  document.getElementById("editId").value = entryId;

  // Formular einblenden und Hauptinhalt ausblenden
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("detailView").style.display = "none"; // Verbergen Sie die Detailansicht
  document.getElementById("editForm").style.display = "block";
}
// Funktion zum Speichern der Bearbeitung
function saveEdit() {
  // Hier können Sie die Logik zum Speichern der Bearbeitung implementieren
  const editedEntry = {
      "title": document.getElementById("editTitle").value,    
      "description": document.getElementById("editDescription").value,
      "content": document.getElementById("editContent").value,
      "author": document.getElementById("editAuthor").value,
      "creationDate": document.getElementById("editCreationDate").value,
      "creationHour": document.getElementById("editCreationHour").value,
      "appendix": document.getElementById("editAppendix").value
  };

  // Suchen Sie den bearbeiteten Eintrag im JSON-Objekt
  const entryId = document.getElementById("editId").value;
  const indexToEdit = jsonData.entries.findIndex(entry => entry.id === entryId);

  // Überprüfen Sie, ob der Eintrag gefunden wurde
  if (indexToEdit !== -1) {
      // Aktualisieren Sie den Eintrag mit den bearbeiteten Werten
      jsonData.entries[indexToEdit] = { ...jsonData.entries[indexToEdit], ...editedEntry };
      
      // Aktualisierte Daten in localStorage speichern
      localStorage.setItem('entries', JSON.stringify(jsonData.entries));
      
      // Anzeige aktualisieren
      displayEntries(jsonData.entries);
  }
  
  // Zurück zur Hauptansicht navigieren
  window.location.href = 'index.html';
}

    // Funktion zum Laden der Daten beim Start der Anwendung
    function loadJsonData() {
        const storedEntries = localStorage.getItem('entries');
        if (storedEntries) {
            return JSON.parse(storedEntries);
        }
        return jsonData.entries;
    }
    // Formular ausblenden und Hauptinhalt einblenden
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("editForm").style.display = "none";

    // Nach dem Speichern die aktualisierten Einträge anzeigen
    displayEntries(jsonData.entries);


// Funktion zum Abbrechen der Bearbeitung
function cancelEdit() {
    // Formular ausblenden und Hauptinhalt einblenden
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("editForm").style.display = "none";
}  
  // Funktion zum Löschen eines Eintrags
  function deleteEntry(entryId) {
    jsonData.entries = jsonData.entries.filter(entry => entry.id !== entryId);
    displayEntries(jsonData.entries);
  }
  
  // Beispielaufruf der Funktionen
  const entriesData = loadJsonData();
  displayEntries(entriesData);
  
  // Beispiel: Hinzufügen eines neuen Eintrags
  const newEntry = {
    "title": "Neuer Eintrag",
    "id": "4",
    "description": "Ein neuer Eintrag für den Tagebuch",
    "author": "Autor: ",
    "content": "Hier steht der Inhalt des Eintrags",
    "creationDate": "Erstelldatum: ",
    "creationHour": "Erstellungszeit: ",
    "appendix": "false"
  };
  
  addEntry(newEntry);
  