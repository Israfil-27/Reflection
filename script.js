class Person {
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
}

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

document.getElementById('saveButton').addEventListener('click', saveData);

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;
            processFileContent(fileContent);
        };

        reader.readAsText(file);
    }
}

function processFileContent(content) {
    const lines = content.split('\n');
    const peopleList = [];

    lines.forEach(line => {
        const [name, age, email] = line.split(',');
        const person = new Person(name, parseInt(age), email);
        peopleList.push(person);
    });

    createTable(peopleList);
}

function createTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';

    const headerRow = table.insertRow(0);
    const headers = ['Name', 'Age', 'Email'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        const text = document.createTextNode(headerText);
        th.appendChild(text);
        headerRow.appendChild(th);
    });

    data.forEach(person => {
        const row = table.insertRow(-1);

        for (const key in person) {
            const cell = row.insertCell();
            const text = document.createTextNode(person[key]);
            cell.appendChild(text);
        }
    });

    document.getElementById('saveButton').style.display = 'block';
}

function saveData() {
    const table = document.getElementById('dataTable');
    const data = [];

    for (let i = 1; i < table.rows.length; i++) {
        const person = new Person(
            table.rows[i].cells[0].innerText,
            parseInt(table.rows[i].cells[1].innerText),
            table.rows[i].cells[2].innerText
        );

        data.push(person);
    }

    fetch('http://localhost:3000/people', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log('isledi:', result);
    })
    .catch(error => {
        console.error('error 404', error);
    });
}
