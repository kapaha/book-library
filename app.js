// Book constructor
function Book(title, author, pages, finished) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.finished = finished;
}

// UI constructor
function UI() {
    this.btnAddBook = document.getElementById('btn-add-book');
    this.formStoreBook = document.getElementById('form-store-book');
    this.formBtnClose = document.getElementById('form-btn-close');
    this.tableBodyBooks = document.querySelector('#table-books tbody');
}

// UI prototype functions
UI.prototype.toggleForm = function() {
    const displayStyle = getComputedStyle(this.formStoreBook).display;
    if (displayStyle === 'none') {
        this.btnAddBook.style.display = 'none';
        this.formStoreBook.style.display = 'block';
    } else {
        this.formStoreBook.style.display = 'none';
        this.btnAddBook.style.display = 'block';
    }
}

UI.prototype.addBookToTable = function(book) {
    const newTableRow = document.createElement('tr');
    newTableRow.innerHTML = ` 
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td>${book.finished}</td>`;
    this.tableBodyBooks.appendChild(newTableRow);
}

UI.prototype.formReset = function () {
    this.formStoreBook.reset();
}

const ui = new UI();

let myLibary = [];

ui.btnAddBook.addEventListener('click', () => ui.toggleForm());

ui.formStoreBook.addEventListener('submit', (e) => {
    // prevent submit
    e.preventDefault();

    // get form values
    const title = ui.formStoreBook.querySelector('#book-title').value;
    const author = ui.formStoreBook.querySelector('#book-author').value;
    const pages = ui.formStoreBook.querySelector('#book-pages').value;
    const finished = ui.formStoreBook.querySelector('#book-finished').checked;
    let formatedFinished = null;

    // validate - incomplete
    if (finished) {
        formatedFinished = 'Yes';
    } else {
        formatedFinished = 'No';
    }

    // instatiate book
    const book = new Book(title, author, pages, formatedFinished);

    // add book to library array, Todo: change this to persistant storage
    myLibary.push(book);

    // add book to UI
    ui.addBookToTable(book);

    // hide and reset form
    ui.toggleForm();
    ui.formReset();
});

ui.formBtnClose.addEventListener('click', () => {
    ui.toggleForm();
    ui.formReset();
})

// manually added books to myLibary for testing
const book1 = new Book('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '800', 'Yes');
const book2 = new Book('The Lord of the Rings', 'J.R.R. Tolkein', '1000', 'No');
const book3 = new Book('City of Bones', 'Cassandra Clare', '600', 'Yes');
ui.addBookToTable(book1);
ui.addBookToTable(book2);
ui.addBookToTable(book3);
