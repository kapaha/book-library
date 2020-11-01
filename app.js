// Book Class
class Book {
    constructor(title, author, pages, read, uniqueId) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.uniqueId = uniqueId;
    }
}

// UI Class
class UI {
    // class properties
    mainContainer = document.getElementById('main-container');
    btnAddBook = document.getElementById('btn-add-book');
    formStoreBook = document.getElementById('form-store-book');
    inputBookTitle = document.getElementById('book-title');
    spanBookTitleError = document.querySelector(
        '#book-title + span.error'
    );
    inputBookAuthor = document.getElementById('book-author');
    spanBookAuthorError = document.querySelector(
        '#book-author + span.error'
    );
    inputBookPages = document.getElementById('book-pages');
    spanBookPagesError = document.querySelector(
        '#book-pages + span.error'
    );
    inputBookRead = document.getElementById('book-read');
    btnCloseForm = document.getElementById('btn-close-form');
    sectionTableGroup = document.querySelector('.table-group');
    tableOfBooks = document.getElementById('table-books');
    tableOfBooksBody = this.tableOfBooks.querySelector('tbody');
    inputFieldsToValidate = [
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

    // class methods
    setupEventListeners() {
        this.btnAddBook.addEventListener('click', () => this.toggleForm());

        this.btnCloseForm.addEventListener('click', () => {
            this.toggleForm();
            this.formReset();
            this.errorReset();
        });

        this.formStoreBook.addEventListener('submit', (e) => {
            // prevent form from submiting
            e.preventDefault();

            // check if form data is valid
            if (this.validateSubmit()) {

                // instatiate book
                const book = new Book(
                    this.inputBookTitle.value,
                    this.inputBookAuthor.value,
                    this.inputBookPages.value,
                    this.inputBookRead.checked,
                    storage.getNextBookUniqueId()
                );

                // add book to UI
                this.addBookToTable(book);

                // add book to localStorage
                storage.addBook(book);

                // hide and reset form
                this.toggleForm();
                this.formReset();

                // show success banner
                this.showBanner('Book Added', 'success');
            }
        });

        // Easter Egg
        // ----------------------------------------------------
        // show banner if 'B' is pressed
        document.addEventListener('keypress', (event) => {
            if (event.key === 'B') {
                ui.showBanner('I Love You', 'danger');
            }
        });
        // ----------------------------------------------------
    }

    setupInputValidation() {
        this.inputFieldsToValidate.forEach((object) => {
            object.inputElement.addEventListener('input', () => {
                if (object.inputElement.validity.valid) {
                    object.errorElement.innerHTML = '';
                    object.errorElement.className = 'error';
                } else {
                    this.showError(object);
                }
            });
        });
    }

    toggleForm() {
        const displayStyle = getComputedStyle(this.formStoreBook).display;
        if (displayStyle === 'none') {
            this.btnAddBook.style.display = 'none';
            this.formStoreBook.style.display = 'block';
        } else {
            this.formStoreBook.style.display = 'none';
            this.btnAddBook.style.display = 'block';
        }
    };

    formReset() {
        this.formStoreBook.reset();
    };

    errorReset() {
        this.inputFieldsToValidate.forEach((object) => {
            object.errorElement.innerHTML = '';
            object.errorElement.className = 'error';
        });
    };

    addBookToTable(book) {
        const newTableRow = document.createElement('tr');

        newTableRow.dataset.bookUniqueId = book.uniqueId;

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

        const bookUniqueId = newTableRow.dataset.bookUniqueId;

        btnToggleRead.addEventListener('click', () => {
            this.toggleRead(btnToggleRead, storage.findBookIndex(bookUniqueId));
            storage.toggleRead(storage.findBookIndex(bookUniqueId));
        });

        btnRemove.addEventListener('click', () => {
            this.removeBook(newTableRow);
            storage.removeBook(storage.findBookIndex(bookUniqueId));
            this.showBanner('Book Removed', 'danger');
        });

        this.tableOfBooksBody.appendChild(newTableRow);
    };

    showError(object) {
        if (object.inputElement.validity.valueMissing) {
            object.errorElement.textContent = object.errorMessageValueMissing;
        } else if (object.inputElement.validity.rangeUnderflow) {
            object.errorElement.textContent = object.errorMessageRangeUnderflow;
        } else if (object.inputElement.validity.badInput) {
            object.errorElement.textContent = object.errorMessageBadInput;
        }
        object.errorElement.className = 'error active';
    };

    toggleRead(button) {
        if (button.classList.contains('btn-toggle-read')) {
            button.classList.remove('btn-toggle-read');
            button.classList.add('btn-toggle-not-read');
            this.showBanner('Book Set To Unread', 'danger');
        } else {
            button.classList.remove('btn-toggle-not-read');
            button.classList.add('btn-toggle-read');
            this.showBanner('Book Set To Read', 'success');
        }
    };

    validateSubmit() {
        this.dataValid = true;
        this.inputFieldsToValidate.forEach((object) => {
            if (!object.inputElement.validity.valid) {
                this.showError(object);
                this.dataValid = false;
            }
        });
        return this.dataValid;
    };

    removeBook(tableRow) {
        tableRow.remove();
    };

    showBanner(message, className) {
        const banner = document.createElement('div');
        banner.className = `event-banner event-banner-${className}`;
        banner.textContent = message;
        this.mainContainer.insertBefore(banner, this.sectionTableGroup);
        setTimeout(() => banner.classList.add('event-banner-animate'), 3000);
        banner.addEventListener('animationend', () => banner.remove());
    };

    setupUI() {
        this.setupEventListeners();
        this.setupInputValidation();
    }

    displayBooks(books) {
        books.forEach(book => this.addBookToTable(book));
    };

    createExampleBooks() {
        const book1 = new Book(
            'Harry Potter and the Sorcerer\'s Stone',
            'J.K. Rowling',
            '800',
            true,
            storage.getNextBookUniqueId()
        );

        const book2 = new Book(
            'The Lord of the Rings',
            'J.R.R. Tolkein',
            '1000',
            false,
            storage.getNextBookUniqueId()
        );

        const book3 = new Book(
            'City of Bones',
            'Cassandra Clare',
            '600',
            true,
            storage.getNextBookUniqueId()
        );

        const book4 = new Book(
            'Squicket - a true love story',
            'Bruno Squhal',
            '1612',
            false,
            storage.getNextBookUniqueId()
        );

        return [book1, book2, book3, book4];
    };
}

// Storage Class
class Storage {
    getBooks() {
        let books;
        if (localStorage.getItem('bookLibrary') === null) {
            books = ui.createExampleBooks();
            localStorage.setItem('bookLibrary', JSON.stringify(books));
        } else {
            books = JSON.parse(localStorage.getItem('bookLibrary'));
        }
        return books;
    };

    addBook(book) {
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem('bookLibrary', JSON.stringify(books));
    };

    removeBook(index) {
        const books = this.getBooks();
        books.splice(index, 1);
        localStorage.setItem('bookLibrary', JSON.stringify(books));

        // reset nextBookUniqueId if library is empty
        if (books.length === 0) {
            localStorage.setItem('nextBookUniqueId', '1');
        }
    };

    toggleRead(index) {
        const books = this.getBooks();
        books[index].read = !books[index].read;
        localStorage.setItem('bookLibrary', JSON.stringify(books));
    };

    findBookIndex(bookUniqueId) {
        const books = this.getBooks();
        return books.findIndex(book => book.uniqueId === bookUniqueId);
    };

    getNextBookUniqueId() {
        let currentBookUniqueId;

        if (localStorage.getItem('nextBookUniqueId') === null) {
            currentBookUniqueId = '1';
        } else {
            currentBookUniqueId = localStorage.getItem('nextBookUniqueId');
        }

        // store incremented bookUniqueId
        const nextBookUniqueId = Number(currentBookUniqueId) + 1;
        localStorage.setItem('nextBookUniqueId', nextBookUniqueId);

        return currentBookUniqueId;
    };

    printLocalStorage() {
        const bookLibraryInStorage = JSON.parse(localStorage.getItem('bookLibrary'));
        const nextBookUniqueId = localStorage.getItem('nextBookUniqueId');
        console.table(bookLibraryInStorage);
        console.log('nextBookUniqueId:', nextBookUniqueId);
    };
}

const ui = new UI();
const storage = new Storage();

// when page loads
// setup UI - eventlisteners and form validation
// display books from local storage
document.addEventListener('DOMContentLoaded', () => {
    ui.setupUI();
    ui.displayBooks(storage.getBooks())
});
