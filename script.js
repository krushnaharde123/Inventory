const breakingCapacityData = {
    '5SL1': ['3KA'],
    '5SJ': ['6KA'],
    'Mexico': ['4.5/6KA'],
    '5SL6': ['7.5KA'],
    '5SL4': ['10KA'],
    'ELSA-2': ['10kA/15kA/20kA'],
    'ELSA-1': ['6KA'],
    '5SL7': ['15KA'],
    'K': ['15KA'],
    'MB': ['7.5KA/10KA'],
    'MB Europe': ['7.5KA/10KA'],
    '5SL7-K': ['15KA']
};

document.addEventListener('DOMContentLoaded', () => {
    const productFamilySelect = document.getElementById('product-family');
    const breakingCapacitySelect = document.getElementById('breaking-capacity');
    const identificationInput = document.getElementById('identification');

    if (productFamilySelect) {
        productFamilySelect.addEventListener('change', () => {
            const selectedProductFamily = productFamilySelect.value;
            updateBreakingCapacity(selectedProductFamily);
            updateIdentification(selectedProductFamily);
        });
    }

    function updateBreakingCapacity(productFamily) {
        breakingCapacitySelect.innerHTML = '';
        const capacities = breakingCapacityData[productFamily];
        if (capacities) {
            capacities.forEach(capacity => {
                const option = document.createElement('option');
                option.value = capacity;
                option.textContent = capacity;
                breakingCapacitySelect.appendChild(option);
            });
        }
    }

    function updateIdentification(productFamily) {
        identificationInput.value = productFamily;
    }

    const addEntryButton = document.getElementById('add-entry');
    if (addEntryButton) {
        addEntryButton.addEventListener('click', addEntry);
    }

    function addEntry() {
        const polarity = document.getElementById('polarity').value;
        const rating = document.getElementById('rating').value;
        const productFamily = document.getElementById('product-family').value;
        const breakingCapacity = document.getElementById('breaking-capacity').value;
        const quantity = document.getElementById('quantity').value;
        const location = document.getElementById('location').value;
        const identification = document.getElementById('identification').value;

        const table = document.getElementById('entry-table').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).textContent = polarity;
        newRow.insertCell(1).textContent = rating;
        newRow.insertCell(2).textContent = productFamily;
        newRow.insertCell(3).textContent = breakingCapacity;
        newRow.insertCell(4).textContent = quantity;
        newRow.insertCell(5).textContent = location;
        newRow.insertCell(6).textContent = identification;
    }

    const addCartonEntryButton = document.getElementById('add-carton-entry');
    if (addCartonEntryButton) {
        addCartonEntryButton.addEventListener('click', addCartonEntry);
    }

    function addCartonEntry() {
        const materialDescription = document.getElementById('material-description').value;
        const materialNumber = document.getElementById('material-number').value;
        const location = document.getElementById('location').value;

        const table = document.getElementById('carton-entry-table').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).textContent = materialDescription;
        newRow.insertCell(1).textContent = materialNumber;
        newRow.insertCell(2).textContent = location;
    }

    const previewCartonFileButton = document.getElementById('preview-carton-file');
    const generateCartonFileButton = document.getElementById('generate-carton-file');
    const cartonEntryTable = document.getElementById('carton-entry-table');
    if (previewCartonFileButton) {
        previewCartonFileButton.addEventListener('click', () => {
            generateCartonFileButton.style.display = 'inline-block';
        });
    }

    if (generateCartonFileButton) {
        generateCartonFileButton.addEventListener('click', generateCartonFile);
    }

    function generateCartonFile() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(cartonEntryTable);
        XLSX.utils.book_append_sheet(wb, ws, 'CartonEntries');
        XLSX.writeFile(wb, 'CartonEntries.xlsx');

        addFileToPhysicalCounting('CartonEntries.xlsx');
    }

    function addFileToPhysicalCounting(fileName) {
        const cartonFilesTable = document.getElementById('carton-files-table').getElementsByTagName('tbody')[0];
        const newRow = cartonFilesTable.insertRow();
        newRow.insertCell(0).textContent = fileName;

        const actionCell = newRow.insertCell(1);
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.className = 'download-file';
        downloadButton.addEventListener('click', () => downloadFile(fileName));
        actionCell.appendChild(downloadButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-file';
        deleteButton.addEventListener('click', () => deleteFile(newRow));
        actionCell.appendChild(deleteButton);
    }

    function downloadFile(fileName) {
        // Implement file download logic
    }

    function deleteFile(row) {
        row.remove();
    }

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hide');
            content.classList.toggle('sidebar-hide');
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', openTab);
    });

    function openTab(event, tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.className = button.className.replace(' active', '');
        });

        document.getElementById(tabName).style.display = 'block';
        event.currentTarget.className += ' active';
    }
});
