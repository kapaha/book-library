let myLibary = [];

function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

function addBookToLibary() {
    const book = new Book(
        prompt('Enter book title'),
        prompt('Enter book author'),
        prompt('Enter amount of pages in book'),
        prompt('Have you read the book? Enter true or false')
    )
    myLibary.push(book);
}
