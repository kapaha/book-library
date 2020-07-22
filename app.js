let myLibary = [];

// book constructor
function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

// create Book object with user input, store in myLibary
function addBookToLibary() {
    const book = new Book(
        prompt('Enter book title'),
        prompt('Enter book author'),
        prompt('Enter amount of pages in book'),
        prompt('Have you read the book? Enter true or false')
    )
    myLibary.push(book);
    render();
}

function render() {
    const bookTable = document.getElementById('books');
    myLibary.forEach(book => {
        if (book.stored) return;

        book.stored = true;

        // create dom elements
        const tableRow = document.createElement('tr');
        const tableDataTitle = document.createElement('td');
        const tableDataAuthor = document.createElement('td');
        const tableDataPages = document.createElement('td');
        const tableDataHaveRead = document.createElement('td');

        // set dom elements text
        tableDataTitle.textContent = book.title;
        tableDataAuthor.textContent = book.author;
        tableDataPages.textContent = book.pages;
        tableDataHaveRead.textContent = book.haveRead;

        // add tds to table row
        tableRow.appendChild(tableDataTitle);
        tableRow.appendChild(tableDataAuthor);
        tableRow.appendChild(tableDataPages);
        tableRow.appendChild(tableDataHaveRead);
        
        // add table row to table
        bookTable.appendChild(tableRow);
    });
}

// manually added books to myLibary for testing
const book1 = new Book('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '800', 'Yes');
const book2 = new Book('The Lord of the Rings', 'J.R.R. Tolkein', '1000', 'No');
const book3 = new Book('City of Bones', 'Cassandra Clare', '600', 'Yes');
myLibary.push(book1, book2, book3);
render();
