// Book constructor
function Book(title, author, pages, read, uniqueId) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.uniqueId = uniqueId;
}

// UI constructor
function UI() {
    this.nextBookUniqueId = 1;
    this.btnAddBook = document.getElementById('btn-add-book');
    this.formStoreBook = document.getElementById('form-store-book');
    this.inputBookTitle = document.getElementById('book-title');
    this.spanBookTitleError = document.querySelector(
        '#book-title + span.error'
    );
    this.inputBookAuthor = document.getElementById('book-author');
    this.spanBookAuthorError = document.querySelector(
        '#book-author + span.error'
    );
    this.inputBookPages = document.getElementById('book-pages');
    this.spanBookPagesError = document.querySelector(
        '#book-pages + span.error'
    );
    this.inputBookRead = document.getElementById('book-read');
    this.btnCloseForm = document.getElementById('btn-close-form');
    this.tableBodyBooks = document.querySelector('#table-books tbody');
    this.inputFieldsToValidate = [
        {
            name: 'title',
            inputElement: this.inputBookTitle,
            errorElement: this.spanBookTitleError,
            errorMessageValueMissing: 'You need to enter a book title'
        },
        {
            name: 'author',
            inputElement: this.inputBookAuthor,
            errorElement: this.spanBookAuthorError,
            errorMessageValueMissing: 'You need to enter a book author'
        },
        {
            name: 'pages',
            inputElement: this.inputBookPages,
            errorElement: this.spanBookPagesError,
            errorMessageValueMissing: 'You need to enter the number of pages',
            errorMessageRangeUnderflow:
            'You need to enter a value greater than 0',
            errorMessageBadInput: 'You need to enter a number'
        }
    ];
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
};

UI.prototype.formReset = function() {
    this.formStoreBook.reset();
};

UI.prototype.errorReset = function() {
    this.inputFieldsToValidate.forEach((object) => {
        object.errorElement.innerHTML = '';
        object.errorElement.className = 'error';
    });
};

UI.prototype.addBookToTable = function(book) {
    const newTableRow = document.createElement('tr');

    newTableRow.dataset.bookUniqueId = book.uniqueId;
    this.nextBookUniqueId += 1;

    newTableRow.innerHTML = ` 
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td class="text-align-center">
            <button class="btn btn-square btn-table">
                <i class="fas fa-book"></i>
            </button>
        </td>
        <td class="text-align-center">
            <button class="btn btn-danger btn-square btn-table">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
        `;

    const btnToggleRead = newTableRow.querySelector('button');
    const btnRemove = newTableRow.querySelector('.btn-danger');


    if (book.read) {
        btnToggleRead.classList.add('btn-toggle-read');
    } else {
        btnToggleRead.classList.add('btn-toggle-not-read');
    }

    btnToggleRead.addEventListener('click', () => {
        this.toggleRead(btnToggleRead, this.findBookIndexFromRow(newTableRow));
    });

    btnRemove.addEventListener('click', () => {
        this.removeBook(newTableRow);
    });

    this.tableBodyBooks.appendChild(newTableRow);
};

UI.prototype.showError = function(object) {
    if (object.inputElement.validity.valueMissing) {
        object.errorElement.textContent = object.errorMessageValueMissing;
    } else if (object.inputElement.validity.rangeUnderflow) {
        object.errorElement.textContent = object.errorMessageRangeUnderflow;
    } else if (object.inputElement.validity.badInput) {
        object.errorElement.textContent = object.errorMessageBadInput;
    }
    object.errorElement.className = 'error active';
};

UI.prototype.toggleRead = function(button, bookIndex) {
    if (button.classList.contains('btn-toggle-read')) {
        button.classList.remove('btn-toggle-read');
        button.classList.add('btn-toggle-not-read');
        myLibary[bookIndex].read = false;
    } else {
        button.classList.remove('btn-toggle-not-read');
        button.classList.add('btn-toggle-read');
        myLibary[bookIndex].read = true;
    }
}

UI.prototype.findBookIndexFromRow = function(tableRow) {
    return myLibary.findIndex(book => 
        book.uniqueId === Number(tableRow.dataset.bookUniqueId));
}

UI.prototype.validateSubmit = function() {
    this.dataValid = true;
    this.inputFieldsToValidate.forEach((object) => {
        if (!object.inputElement.validity.valid) {
            this.showError(object);
            this.dataValid = false;
        }
    });
    return this.dataValid;
};

UI.prototype.removeBook = function(tableRow) {
    const bookIndex = this.findBookIndexFromRow(tableRow);
    myLibary.splice(bookIndex, 1);
    tableRow.remove();
}

const ui = new UI();

let myLibary = [];

ui.btnAddBook.addEventListener('click', () => ui.toggleForm());

ui.btnCloseForm.addEventListener('click', () => {
    ui.toggleForm();
    ui.formReset();
    ui.errorReset();
});

ui.inputFieldsToValidate.forEach((object) => {
    object.inputElement.addEventListener('input', () => {
        if (object.inputElement.validity.valid) {
            object.errorElement.innerHTML = '';
            object.errorElement.className = 'error';
        } else {
            ui.showError(object);
        }
    });
});

ui.formStoreBook.addEventListener('submit', (e) => {
    // prevent form from submiting
    e.preventDefault();

    // check if form data is valid
    if (ui.validateSubmit()) {

        // instatiate book
        const book = new Book(
            ui.inputBookTitle.value,
            ui.inputBookAuthor.value,
            ui.inputBookPages.value,
            ui.inputBookRead.checked,
            ui.nextBookUniqueId
        );

        // add book to library, Todo: change this to persistant storage
        myLibary.push(book);

        // add book to UI
        ui.addBookToTable(book);

        // hide and reset form
        ui.toggleForm();
        ui.formReset();
    }
});

// manually added books to myLibary for testing
const book1 = new Book(
    'Harry Potter and the Sorcerer\'s Stone',
    'J.K. Rowling',
    '800',
    true,
    ui.nextBookUniqueId
);
myLibary.push(book1);
ui.addBookToTable(book1);

const book2 = new Book(
    'The Lord of the Rings', 
    'J.R.R. Tolkein', 
    '1000', 
    false,
    ui.nextBookUniqueId
);
myLibary.push(book2);
ui.addBookToTable(book2);

const book3 = new Book(
    'City of Bones', 
    'Cassandra Clare', 
    '600', 
    true,
    ui.nextBookUniqueId
);
myLibary.push(book3);
ui.addBookToTable(book3);
