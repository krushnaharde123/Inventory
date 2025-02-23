document.addEventListener('DOMContentLoaded', function() {
    const breakingCapacities = {
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

    const productFamilySelect = document.getElementById('product-family');
    const breakingCapacitySelect = document.getElementById('breaking-capacity');
    const polaritySelect = document.getElementById('polarity');
    const ratingSelect = document.getElementById('rating');
    const quantityInput = document.getElementById('quantity');
    const locationInput = document.getElementById('location');
    const entryTableBody = document.getElementById('entry-table').querySelector('tbody');
    const previewEntryFileButton = document.getElementById('preview-entry-file');
    const saveEntryFileButton = document.getElementById('save-entry-file');
    const allEntries = [];

    // Update breaking capacity options based on selected product family
    productFamilySelect.addEventListener('change', () => {
        const selectedFamily = productFamilySelect.value;
        const capacities = breakingCapacities[selectedFamily] || [];
        breakingCapacitySelect.innerHTML = '';
        capacities.forEach(capacity => {
            const option = document.createElement('option');
            option.value = capacity;
            option.textContent = capacity;
            breakingCapacitySelect.appendChild(option);
        });
    });

    document.getElementById('add-entry').addEventListener('click', () => {
        const polarity = polaritySelect.value;
        const rating = ratingSelect.value;
        const productFamily = productFamilySelect.value;
        const breakingCapacity = breakingCapacitySelect.value;
        const quantity = quantityInput.value;
        const location = locationInput.value;

        if (!polarity || !rating || !productFamily || !breakingCapacity || !quantity || !location) {
            alert('Please fill all fields before adding entry.');
            return;
        }

        const entry = { polarity, rating, productFamily, breakingCapacity, quantity, location };
        allEntries.push(entry);

        displayEntries();

        polaritySelect.value = '';
        ratingSelect.value = '';
        productFamilySelect.value = '';
        breakingCapacitySelect.innerHTML = '';
        quantityInput.value = '';
        locationInput.value = '';
    });

    function displayEntries() {
        entryTableBody.innerHTML = '';
        allEntries.forEach((entry, index) => {
            const row = document.createElement('tr');
            if (index === allEntries.length - 1) {
                row.classList.add('bold');
            }
            row.innerHTML = `<td>${entry.polarity}</td><td>${entry.rating}</td><td>${entry.productFamily}</td><td>${entry.breakingCapacity}</td><td>${entry.quantity}</td><td>${entry.location}</td><td><button type="button" class="edit-button">Edit</button></td>`;
            entryTableBody.appendChild(row);
        });
    }

    previewEntryFileButton.addEventListener('click', () => {
        if (allEntries.length === 0) {
            alert('No entries to preview.');
            return;
        }
        displayEntries();
        saveEntryFileButton.style.display = 'inline-block';
    });

    saveEntryFileButton.addEventListener('click', () => {
        const fileName = prompt('Enter file name:', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
        if (fileName) {
            const csvHeader = "Polarity,Rating,Product Family,Breaking Capacity,Quantity,Location";
            const csvRows = allEntries.map(entry => `${entry.polarity},${entry.rating},${entry.productFamily},${entry.breakingCapacity},${entry.quantity},${entry.location}`);
            const csvContent = `${csvHeader}\n${csvRows.join('\n')}`;
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const file = {
                name: `${fileName}.csv`,
                content: url
            };
            saveFileToLocalStorage(file, 'mcbFiles');
            alert('File saved successfully.');
        }
    });

    function saveFileToLocalStorage(file, type) {
        const storedFiles = JSON.parse(localStorage.getItem(type)) || [];
        storedFiles.push(file);
        localStorage.setItem(type, JSON.stringify(storedFiles));
        renderFiles();
    }

    // Carton Entry page logic
    const cartonMasterFileInput = document.getElementById('carton-master-file');
    const materialDescriptionInput = document.getElementById('material-description');
    const materialNumberInput = document.getElementById('material-number');
    const cartonEntryTableBody = document.getElementById('carton-entry-table').querySelector('tbody');
    const previewCartonFileButton = document.getElementById('preview-carton-file');
    const saveCartonFileButton = document.getElementById('save-carton-file');
    const allCartonEntries = [];

    let masterData = [];

    cartonMasterFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                masterData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                populateMaterialList(masterData);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function populateMaterialList(data) {
        const materialList = document.getElementById('material-list');
        materialList.innerHTML = '';
        data.forEach((item, index) => {
            if (index === 0) return; // Skip header row
            const option = document.createElement('option');
            option.value = item[0]; // Description
            materialList.appendChild(option);
        });
    }

    materialDescriptionInput.addEventListener('input', (event) => {
        const description = event.target.value;
        const material = masterData.find(item => item[0] === description);
        if (material) {
            materialNumberInput.value = material[1]; // Material Number
        } else {
            materialNumberInput.value = '';
        }
    });

    document.getElementById('add-carton-entry').addEventListener('click', () => {
        const description = materialDescriptionInput.value;
        const materialNumber = materialNumberInput.value;
        const quantity = document.getElementById('carton-quantity').value;
        const location = document.getElementById('carton-location').value;

        if (!description || !materialNumber || !quantity || !location) {
            alert('Please fill in all required fields.');
            return;
        }

        const entry = { description, materialNumber, quantity, location };
        allCartonEntries.push(entry);

        displayCartonEntries();

        materialDescriptionInput.value = '';
        materialNumberInput.value = '';
        document.getElementById('carton-quantity').value = '';
        document.getElementById('carton-location').value = '';
    });

    function displayCartonEntries() {
        cartonEntryTableBody.innerHTML = '';
        allCartonEntries.forEach((entry, index) => {
            const row = document.createElement('tr');
            if (index === allCartonEntries.length - 1) {
                row.classList.add('bold');
            }
            row.innerHTML = `<td>${entry.description}</td><td>${entry.materialNumber}</td><td>${entry.quantity}</td><td>${entry.location}</td><td><button type="button" class="edit-button">Edit</button></td>`;
            cartonEntryTableBody.appendChild(row);
        });
    }

    previewCartonFileButton.addEventListener('click', () => {
        if (allCartonEntries.length === 0) {
            alert('No entries to preview.');
            return;
        }
        displayCartonEntries();
        saveCartonFileButton.style.display = 'inline-block';
    });

    saveCartonFileButton.addEventListener('click', () => {
        const fileName = prompt('Enter file name:', `carton_${new Date().toISOString().split('T')[0]}.csv`);
        if (fileName) {
            const csvHeader = "Description,Material Number,Quantity,Location";
            const csvRows = allCartonEntries.map(entry => `${entry.description},${entry.materialNumber},${entry.quantity},${entry.location}`);
            const csvContent = `${csvHeader}\n${csvRows.join('\n')}`;

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const file = {
                name: `${fileName}.csv`,
                content: url
            };
            saveFileToLocalStorage(file, 'cartonFiles');
            alert('File saved successfully.');
        }
    });

    // Physical Counting page logic
    const mcbFilesTableBody = document.getElementById('mcb-files-table').querySelector('tbody');
    const cartonFilesTableBody = document.getElementById('carton-files-table').querySelector('tbody');

    function renderFiles() {
        const storedMcbFiles = JSON.parse(localStorage.getItem('mcbFiles')) || [];
        mcbFilesTableBody.innerHTML = '';
        storedMcbFiles.forEach((file, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${file.name}</td><td><button class="download-file" data-index="${index}" data-type="mcb">Download</button> <button class="delete-file" data-index="${index}" data-type="mcb">Delete</button></td>`;
            mcbFilesTableBody.appendChild(row);
        });

        const storedCartonFiles = JSON.parse(localStorage.getItem('cartonFiles')) || [];
        cartonFilesTableBody.innerHTML = '';
        storedCartonFiles.forEach((file, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${file.name}</td><td><button class="download-file" data-index="${index}" data-type="carton">Download</button> <button class="delete-file" data-index="${index}" data-type="carton">Delete</button></td>`;
            cartonFilesTableBody.appendChild(row);
        });
    }

    function handleFileActions(event) {
        const index = event.target.getAttribute('data-index');
        const type = event.target.getAttribute('data-type');
        let storedFiles = JSON.parse(localStorage.getItem(`${type}Files`)) || [];
        if (event.target.classList.contains('download-file')) {
            const file = storedFiles[index];
            const link = document.createElement('a');
            link.setAttribute('href', file.content);
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
        } else if (event.target.classList.contains('delete-file')) {
            storedFiles.splice(index, 1);
            localStorage.setItem(`${type}Files`, JSON.stringify(storedFiles));
            renderFiles();
        }
    }

    mcbFilesTableBody.addEventListener('click', handleFileActions);
    cartonFilesTableBody.addEventListener('click', handleFileActions);

    document.addEventListener('DOMContentLoaded', renderFiles);

    function openTab(event, tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(tabButton => {
            tabButton.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    }
});
