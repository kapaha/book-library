// Book constructor
function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

// UI constructor
function UI() {
}

// UI prototype functions
UI.prototype.toggleForm = function() {
    const formAddBook = document.getElementById('add-book-form');
    const displayStyle = getComputedStyle(formAddBook).display;
    const buttonAddBook = document.getElementById('add-book-btn');
    if (displayStyle === 'none') {
        formAddBook.style.display = 'block';
        buttonAddBook.style.display = 'none';
    } else {
        formAddBook.style.display = 'none';
        buttonAddBook.style.display = 'block';
    }
}

UI.prototype.render = function() {
    const bookTable = document.getElementById('book-table');
    myLibary.forEach(book => {
        if (book.stored) return;

        book.stored = true;

        // create dom elements
        const tableRow = document.createElement('tr');
        const tableDataTitle = document.createElement('td');
        const tableDataAuthor = document.createElement('td');
        const tableDataPages = document.createElement('td');
        const finished = document.createElement('td');

        // set dom elements text
        tableDataTitle.textContent = book.title;
        tableDataAuthor.textContent = book.author;
        tableDataPages.textContent = book.pages;
        finished.textContent = book.haveRead;

        // add tds to table row
        tableRow.appendChild(tableDataTitle);
        tableRow.appendChild(tableDataAuthor);
        tableRow.appendChild(tableDataPages);
        tableRow.appendChild(finished);

        // add table row to table
        bookTable.appendChild(tableRow);
    });
}

UI.prototype.addBookToLibary = function () {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const numberOfPages = document.getElementById('book-pages').value;

    let finished = document.getElementById('checkbox-1').checked;
    if (finished) {
        finished = 'Yes';
    } else {
        finished = 'No';
    }

    const book = new Book(title, author, numberOfPages, finished);
    myLibary.push(book);
}

UI.prototype.formReset = function () {
    const formAddBook = document.getElementById('add-book-form');
    formAddBook.reset();
}

const ui = new UI();

let myLibary = [];

// manually added books to myLibary for testing
const book1 = new Book('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '800', 'Yes');
const book2 = new Book('The Lord of the Rings', 'J.R.R. Tolkein', '1000', 'No');
const book3 = new Book('City of Bones', 'Cassandra Clare', '600', 'Yes');
myLibary.push(book1, book2, book3);
ui.render();

document.getElementById('add-book-btn').addEventListener('click', (e) => {
    ui.toggleForm();
});

document.getElementById('add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    ui.addBookToLibary();
    ui.render();
    ui.toggleForm();
    ui.formReset();
});
