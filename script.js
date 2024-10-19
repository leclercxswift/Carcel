document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const now = new Date();
        const formattedDate = now.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        dateInput.value = formattedDate;
    }
    loadInmates();
});

document.getElementById('inmate-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const now = new Date();
    const formattedDate = now.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const crime = document.getElementById('crime').value;
    const sentence = document.getElementById('sentence').value;
    const date = formattedDate;

    const inmate = { name, id, crime, sentence, date };

    let inmates = JSON.parse(localStorage.getItem('inmates')) || [];
    const existingRow = document.querySelector(`tr[data-id='${id}']`);
    if (existingRow) {
        const index = inmates.findIndex(inmate => inmate.id === id);
        inmates[index] = inmate; 
        existingRow.replaceWith(createInmateRow(inmate));
    } else {
        inmates.push(inmate); 
        document.getElementById('inmate-list').appendChild(createInmateRow(inmate));
    }
    
    localStorage.setItem('inmates', JSON.stringify(inmates)); 
    document.getElementById('inmate-form').reset();
    dateInput.value = formattedDate; 
});

function createInmateRow(inmate) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', inmate.id);
    row.innerHTML = `
        <td>${inmate.name}</td>
        <td>${inmate.id}</td>
        <td>${inmate.crime}</td>
        <td>${inmate.sentence}</td>
        <td>${inmate.date}</td>
        <td>
            <button class="btn btn-warning btn-sm edit">Editar</button>
            <button class="btn btn-danger btn-sm delete">Eliminar</button>
        </td>
    `;

    row.querySelector('.edit').addEventListener('click', () => editInmate(inmate));
    row.querySelector('.delete').addEventListener('click', () => deleteInmate(inmate.id));

    return row;
}

function loadInmates() {
    let inmates = JSON.parse(localStorage.getItem('inmates')) || [];
    inmates.forEach(inmate => document.getElementById('inmate-list').appendChild(createInmateRow(inmate)));
}

function deleteInmate(id) {
    let inmates = JSON.parse(localStorage.getItem('inmates')) || [];
    inmates = inmates.filter(inmate => inmate.id !== id);
    localStorage.setItem('inmates', JSON.stringify(inmates));

    document.getElementById('inmate-list').innerHTML = '';
    loadInmates();
}

function editInmate(inmate) {
    document.getElementById('name').value = inmate.name;
    document.getElementById('id').value = inmate.id;
    document.getElementById('crime').value = inmate.crime;
    document.getElementById('sentence').value = inmate.sentence;
    document.getElementById('date').value = inmate.date; 
}