const rolesPermissions = {
    "Guardia": { canView: true, canAdd: false, canEdit: false, canDelete: false },
    "Médico": { canView: true, canAdd: true, canEdit: true, canDelete: true },
    "Psicólogo": { canView: true, canAdd: true, canEdit: true, canDelete: true },
    "Otro": { canView: false, canAdd: false, canEdit: false, canDelete: false },
    "Jefe de Seguridad": { canView: true, canAdd: true, canEdit: true, canDelete: true, canViewSecurityReports: true }
};

let currentRole = "Guardia"; 
let editingId = null;

document.addEventListener('DOMContentLoaded', function () {
    updateUIBasedOnRole();

    document.getElementById('staff-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const staffName = document.getElementById('staffName').value;
        const staffRole = document.getElementById('staffRole').value;

        if (editingId) {
            // Editar
            let staffList = JSON.parse(localStorage.getItem('staffList')) || [];
            const index = staffList.findIndex(s => s.id === editingId);
            if (index !== -1) {
                staffList[index] = { id: editingId, staffName, staffRole };
                localStorage.setItem('staffList', JSON.stringify(staffList));
                editingId = null; // Reiniciar ID de edición
            }
        } else {
            // Agregar nuevo personal
            if (rolesPermissions[currentRole].canAdd) {
                const staff = { id: Date.now(), staffName, staffRole };
                let staffList = JSON.parse(localStorage.getItem('staffList')) || [];
                staffList.push(staff);
                localStorage.setItem('staffList', JSON.stringify(staffList));
            } else {
                alert("No tienes permiso para agregar personal.");
            }
        }

        loadStaff();
        document.getElementById('staff-form').reset();
    });

    document.getElementById('switch-role').addEventListener('click', switchRole);

    loadStaff();
});

function switchRole() {
    const roleList = Object.keys(rolesPermissions);
    const currentIndex = roleList.indexOf(currentRole);
    currentRole = roleList[(currentIndex + 1) % roleList.length];
    updateUIBasedOnRole();
}

function updateUIBasedOnRole() {
    document.getElementById('current-role').innerText = currentRole;

    if (!rolesPermissions[currentRole].canAdd) {
        document.getElementById('staff-form').style.display = 'none';
    } else {
        document.getElementById('staff-form').style.display = 'block';
    }

    if (rolesPermissions[currentRole].canViewSecurityReports) {
        document.getElementById('security-reports').style.display = 'block';
    } else {
        document.getElementById('security-reports').style.display = 'none';
    }

    loadStaff();
}

function loadStaff() {
    let staffList = JSON.parse(localStorage.getItem('staffList')) || [];
    const staffTable = document.getElementById('staff-list');
    staffTable.innerHTML = '';

    staffList.forEach(staff => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${staff.staffName}</td>
            <td>${staff.staffRole}</td>
            <td>
                ${rolesPermissions[currentRole].canEdit ? `<button class="btn btn-warning btn-sm edit" onclick="editStaff(${staff.id})">Editar</button>` : ''}
                ${rolesPermissions[currentRole].canDelete ? `<button class="btn btn-danger btn-sm delete" onclick="deleteStaff(${staff.id})">Eliminar</button>` : ''}
            </td>
        `;
        staffTable.appendChild(row);
    });
}

function editStaff(id) {
    if (rolesPermissions[currentRole].canEdit) {
        let staffList = JSON.parse(localStorage.getItem('staffList')) || [];
        const staff = staffList.find(s => s.id === id);

        if (staff) {
            document.getElementById('staffName').value = staff.staffName;
            document.getElementById('staffRole').value = staff.staffRole;
            editingId = staff.id; 
        }
    } else {
        alert("No tienes permiso para editar personal.");
    }
}

function deleteStaff(id) {
    if (rolesPermissions[currentRole].canDelete) {
        let staffList = JSON.parse(localStorage.getItem('staffList')) || [];
        staffList = staffList.filter(staff => staff.id !== id);
        localStorage.setItem('staffList', JSON.stringify(staffList));
        loadStaff();
    } else {
        alert("No tienes permiso para eliminar personal.");
    }
}