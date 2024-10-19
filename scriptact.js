document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('activity-report-form');
    const reportList = document.getElementById('report-list');
    
   
    let activityReports = JSON.parse(localStorage.getItem('activityReports')) || [];

  
    function saveReports() {
        localStorage.setItem('activityReports', JSON.stringify(activityReports));
    }


    function loadReports() {
        reportList.innerHTML = '';
        activityReports.forEach(report => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                <strong>Fecha:</strong> ${report.date} <br>
                <strong>Número de Visitas:</strong> ${report.visits} <br>
                <strong>Eventos:</strong> ${report.events || 'No hubo eventos especiales'} <br>
                <strong>Actividades Recreativas:</strong> ${report.recreationalActivities || 'No hubo actividades recreativas'}
            `;
            reportList.appendChild(listItem);
        });
    }

  
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
       
        const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
        
   
        const visits = document.getElementById('visitsCount').value;
        const events = document.getElementById('events').value;
        const recreationalActivities = document.getElementById('recreationalActivities').value;

       
        const newReport = {
            date,
            visits,
            events,
            recreationalActivities
        };

      
        activityReports.push(newReport);
        saveReports();
        loadReports();

      
        reportForm.reset();
    });

    
    loadReports();
});