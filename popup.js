// Example: Replace this with actual data from your extension
const changes = [
    { description: "Quote status updated to 'Approved'" },
    { description: "New item added to quote: 'Widget A'" },
    { description: "Customer details modified" }
];

const changesList = document.getElementById('changes-list');
const noChangesDiv = document.getElementById('no-changes');

if (changes.length === 0) {
    noChangesDiv.style.display = 'block';
} else {
    changes.forEach(change => {
        const li = document.createElement('li');
        li.className = 'change';
        li.textContent = change.description;
        changesList.appendChild(li);
    });
}
