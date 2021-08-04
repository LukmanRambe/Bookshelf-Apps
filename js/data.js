const STORAGE_KEY = 'BOOKS';
let books = [];

const isStorageExist = () => {
	if (typeof Storage === undefined) {
		alert('Browser tidak mendukung web storage');
		return false;
	}

	return true;
};

const saveBookData = () => {
	const parsed = JSON.stringify(books);
	localStorage.setItem(STORAGE_KEY, parsed);

	document.dispatchEvent(new Event('ondatasaved'));
};

const loadStorageData = () => {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		books = data;

		document.dispatchEvent(new Event('ondataloaded'));
	}
};

const updateStorageData = () => {
	if (isStorageExist()) saveBookData();
};

function composeBookObject(title, author, publishedYear, isFinished) {
	return {
		id: +new Date(),
		title,
		author,
		publishedYear,
		isFinished,
	};
}

const findBook = (bookId) => {
	for (book of books) {
		if (book.id === bookId) return book;
	}

	return null;
};

const findBookIndex = (bookId) => {
	let index = 0;
	for (book of books) {
		if (book.id === bookId) return index;

		index++;
	}

	return -1;
};

const refreshDataFromBooks = () => {
	for (book of books) {
		const newBook = makeBook(book.title, book.author, book.publishedYear, book.isFinished);
		newBook[BOOK_ITEMID] = book.id;

		if (book.isFinished) {
			finishedList.append(newBook);
		} else {
			unfinishedList.append(newBook);
		}
	}
};

const searchBooks = (bookTitle) => {
	books.filter((book) => {
		if (book.title.toLowerCase().match(bookTitle.value.toLowerCase())) {
			if (book.isFinished) {
				const searchedBooks = makeBook(book.title, book.author, book.publishedYear, true);
				finishedList.append(searchedBooks);
			} else {
				const searchedBooks = makeBook(book.title, book.author, book.publishedYear, false);
				unfinishedList.append(searchedBooks);
			}
		}
	});
};
