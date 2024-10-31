  const createNoteBtn = document.getElementById('createNoteBtn');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const noteForm = document.getElementById('noteForm');
  const notesContainer = document.getElementById('notesContainer');

  function getNotes() {
    return JSON.parse(localStorage.getItem('notes')) || [];
  }

  function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  function renderNotes(showArchived = false) {
    notesContainer.innerHTML = '';
    const notes = getNotes();

    notes.forEach((note, index) => {
      if (note.archived === showArchived) {
        const noteElement = document.createElement('div');
        noteElement.classList.add('col-md-4');
        noteElement.innerHTML = `
          <div class="card mb-4" data-index="${index}">
            <div class="card-body">
              <h5 class="card-title">${note.title} ${note.pinned ? '<span class="badge badge-warning">Pinned</span>' : ''}</h5>
              <p class="card-text">${note.body}</p>
              <div class="d-flex justify-content-between">
                ${showArchived ? 
                `<button class="btn btn-sm btn-secondary unarchive-note">Unarchive</button>` : 
                `<button class="btn btn-sm btn-secondary archive-note">Archive</button>`}
                <button class="btn btn-sm btn-danger delete-note">Delete</button>
              </div>
            </div>
          </div>
        `;
        if (note.pinned) {
          notesContainer.prepend(noteElement);
        } else {
          notesContainer.append(noteElement);
        }
      }
    });
  }

  notesContainer.addEventListener('click', (event) => {
    const index = event.target.closest('.card').dataset.index;
    if (event.target.classList.contains('archive-note')) {
      archiveNote(index);
    } else if (event.target.classList.contains('unarchive-note')) {
      unarchiveNote(index);
    } else if (event.target.classList.contains('delete-note')) {
      deleteNote(index);
    }
  });

  function archiveNote(index) {
    const notes = getNotes();
    notes[index].archived = true;
    saveNotes(notes);
    renderNotes();
  }

  function unarchiveNote(index) {
    const notes = getNotes();
    notes[index].archived = false;
    saveNotes(notes);
    renderNotes(true);
  }

  function deleteNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    renderNotes();
  }

  createNoteBtn.addEventListener('click', () => {
    $('#noteModal').modal('show');
  });

  saveNoteBtn.addEventListener('click', () => {
    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;
    const labels = document.getElementById('noteLabels').value.split(',').map(label => label.trim());
    const pinned = document.getElementById('pinNote').checked;

    if (title && body) {
      const notes = getNotes();
      notes.push({
        title,
        body,
        labels,
        pinned,
        archived: false,
        createdAt: new Date().toISOString()
      });
      saveNotes(notes);
      renderNotes();
      $('#noteModal').modal('hide');
      noteForm.reset();
    }
  });

  document.getElementById('showActiveNotes').addEventListener('click', () => {
    renderNotes(false);
  });

  document.getElementById('showArchivedNotes').addEventListener('click', () => {
    renderNotes(true);
  });

  document.addEventListener('DOMContentLoaded', () => renderNotes(false));
