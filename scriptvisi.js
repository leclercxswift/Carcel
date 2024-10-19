document.addEventListener('DOMContentLoaded', function () {
    loadInmates();
    loadVisits();

    // Evento para cargar las últimas 5 visitas al seleccionar un recluso
    document.getElementById('inmateId').addEventListener('change', function () {
        const inmateId = this.value;
        if (inmateId) {
            showLastFiveVisits(inmateId);
        } else {
            document.getElementById('last-visits').innerHTML = '';
        }
    });
});

document.getElementById('visit-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const visitorName = document.getElementById('visitorName').value;
    const visitDate = new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const inmateId = document.getElementById('inmateId').value;

    const visit = { visitorName, visitDate, inmateId };

    let visits = JSON.parse(localStorage.getItem('visits')) || [];
    visits.push(visit);
    localStorage.setItem('visits', JSON.stringify(visits));

    
    loadVisits();
    showLastFiveVisits(inmateId);

    document.getElementById('visit-form').reset();
});

function loadInmates() {
    let inmates = JSON.parse(localStorage.getItem('inmates')) || [];
    const inmateSelect = document.getElementById('inmateId');
    inmateSelect.innerHTML = '<option value="">Seleccione un recluso</option>';
    inmates.forEach(inmate => {
        const option = document.createElement('option');
        option.value = inmate.id;
        option.textContent = inmate.name;
        inmateSelect.appendChild(option);
    });
}

function loadVisits() {
    let visits = JSON.parse(localStorage.getItem('visits')) || [];
    const visitList = document.getElementById('visit-list');
    visitList.innerHTML = '';

    visits.forEach(visit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${visit.visitorName}</td>
            <td>${visit.visitDate}</td>
            <td>${getInmateName(visit.inmateId)}</td>
            <td>
                <button class="btn btn-danger btn-sm delete" onclick="deleteVisit('${visit.visitDate}')">Eliminar</button>
            </td>
        `;
        visitList.appendChild(row);
    });
}

function showLastFiveVisits(inmateId) {
    let visits = JSON.parse(localStorage.getItem('visits')) || [];
    const filteredVisits = visits.filter(visit => visit.inmateId === inmateId);

    // Ordenar las visitas por fecha de más reciente a más antigua
    const sortedVisits = filteredVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

    // Tomar las primeras 5 visitas más recientes
    const lastFiveVisits = sortedVisits.slice(0, 5);

    // Mostrar las visitas en el UL
    const visitList = document.getElementById('last-visits');
    visitList.innerHTML = ''; // Limpiar la lista antes de cargar las visitas

    lastFiveVisits.forEach(visit => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${visit.visitDate}: ${visit.visitorName}`;
        visitList.appendChild(listItem);
    });

    // Si no hay visitas, mostrar un mensaje
    if (lastFiveVisits.length === 0) {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = 'No hay visitas registradas para este recluso.';
        visitList.appendChild(listItem);
    }
}

function getInmateName(id) {
    const inmates = JSON.parse(localStorage.getItem('inmates')) || [];
    const inmate = inmates.find(i => i.id === id);
    return inmate ? inmate.name : 'Desconocido';
}

function deleteVisit(date) {
    let visits = JSON.parse(localStorage.getItem('visits')) || [];
    visits = visits.filter(visit => visit.visitDate !== date);
    localStorage.setItem('visits', JSON.stringify(visits));
    loadVisits();
}