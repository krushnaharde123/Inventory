document.addEventListener('DOMContentLoaded', function() {
    // Function to update UTC time
    function updateTime() {
        const now = new Date();
        const utcString = now.toISOString().replace('T', ' ').substr(0, 19);
        document.getElementById('current-time').textContent = `UTC: ${utcString}`;
    }

    // Function to get the current user
    function getCurrentUser() {
        return 'krushnaharde123';
    }

    // Function to set the current user in the UI
    function setCurrentUser() {
        const userLoginSpan = document.getElementById('user-login');
        if (userLoginSpan) {
            userLoginSpan.textContent = `User: ${getCurrentUser()}`;
        }
    }

    // Initialize
    updateTime();
    setCurrentUser();
    setInterval(updateTime, 1000);

    // Carton Entry page logic
    const cartonMasterFileInput = document.getElementById('carton-master-file');
    const materialDescriptionInput = document.getElementById('material-description');
    const materialNumberInput = document.getElementById('material-number');

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
                masterData = XLSX.utils.sheet_to_json(worksheet);
                populateMaterialList(masterData);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function populateMaterialList(data) {
        const materialList = document.getElementById('material-list');
        materialList.innerHTML = '';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item['Description'];
            materialList.appendChild(option);
        });
    }

    materialDescriptionInput.addEventListener('input', (event) => {
        const description = event.target.value;
        const material = masterData.find(item => item['Description'] === description);
        if (material) {
            materialNumberInput.value = material['Material Number'];
        } else {
            materialNumberInput.value = '';
        }
    });

    // MCB Entry page logic
    const productFamilySelect = document.getElementById('product-family');
    const breakingCapacitySelect = document.getElementById('breaking-capacity');
    const identificationSpan = document.getElementById('identification');

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

    productFamilySelect.addEventListener('change', (event) => {
        const family = event.target.value;
        const capacities = breakingCapacities[family] || [];
        populateBreakingCapacity(capacities);
        identificationSpan.textContent = family;
        identificationSpan.classList.add('highlighted');
    });

    function populateBreakingCapacity(capacities) {
        breakingCapacitySelect.innerHTML = '';
        capacities.forEach(capacity => {
            const option = document.createElement('option');
            option.value = capacity;
            option.textContent = capacity;
            breakingCapacitySelect.appendChild(option);
        });
    }
});
