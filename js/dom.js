const unfinishedList = document.querySelector('.unfinished-list');
const finishedList = document.querySelector('.finished-list');
const BOOK_ITEMID = 'itemId';

const addBook = () => {
	const bookTitle = document.getElementById('title');
	const bookAuthor = document.getElementById('author');
	const bookPublishedYear = document.getElementById('published');
	const publishedYearFirstNumber = bookPublishedYear.value.split('')[0];

	if (bookTitle.value != '' && bookAuthor.value != '' && bookPublishedYear.value != '') {
		if (publishedYearFirstNumber != 0) {
			const book = makeBook(bookTitle.value, bookAuthor.value, bookPublishedYear.value);
			const bookObject = composeBookObject(bookTitle.value, bookAuthor.value, bookPublishedYear.value, false);

			book[BOOK_ITEMID] = bookObject.id;
			books.push(bookObject);

			bookTitle.value = '';
			bookAuthor.value = '';
			bookPublishedYear.value = '';

			unfinishedList.append(book);
			updateStorageData();

			Swal.fire({
				title: 'Success!',
				text: 'Book added to the shelf!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'btn finished-btn swal-btn',
				},
			});
		} else {
			Swal.fire({
				title: 'Invalid Input',
				text: 'Published year first number cannot be 0',
				icon: 'warning',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'btn finished-btn swal-btn',
				},
			});
		}
	} else {
		Swal.fire({
			title: 'Empty Field',
			text: 'Please fill out the form',
			icon: 'warning',
			confirmButtonText: 'OK',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'btn finished-btn swal-btn',
			},
		});
	}
};

const makeBook = (title, author, publishedYear, isFinished) => {
	const bookDetails = document.createElement('div');
	bookDetails.classList.add('card', 'book-details', 'mt-3');
	bookDetails.innerHTML = `<h5 class='title'>${title}</h5>
		                     <div class='author'>Author : ${author}</div>
		                     <div class='published'>Published : ${publishedYear}</div>`;

	const actionBtnContainer = document.createElement('div');
	actionBtnContainer.classList.add('action', 'd-flex', 'justify-content-end');

	if (isFinished) {
		actionBtnContainer.append(createUnfinishedBtn(), createRemoveBtn());
	} else {
		actionBtnContainer.append(createFinishedBtn(), createRemoveBtn());
	}

	bookDetails.append(actionBtnContainer);

	return bookDetails;
};

const createBtn = (classType, isFinished, eventListener) => {
	const button = document.createElement('button');
	button.classList.add('btn', classType);

	if (isFinished) {
		button.innerText = `Unfinished`;
	} else {
		button.innerText = `Finished`;
	}

	if (classType == 'remove-btn') {
		button.innerText = `Remove`;
	}

	button.addEventListener('click', (event) => {
		eventListener(event);
	});

	return button;
};

const moveToFinished = (bookElement) => {
	const title = bookElement.querySelector('.title').innerText;
	const author = bookElement.querySelector('.author').innerText.split(':').slice(1);
	const publishedYear = bookElement.querySelector('.published').innerText.split(':').slice(1);

	const newBook = makeBook(title, author, publishedYear, true);
	const book = findBook(bookElement[BOOK_ITEMID]);

	book.isFinished = true;
	newBook[BOOK_ITEMID] = book.id;

	finishedList.append(newBook);
	bookElement.remove();
	updateStorageData();
};

const moveToUnfinished = (bookElement) => {
	const title = bookElement.querySelector('.title').innerText;
	const author = bookElement.querySelector('.author').innerText.split(':').slice(1);
	const publishedYear = bookElement.querySelector('.published').innerText.split(':').slice(1);

	const newBook = makeBook(title, author, publishedYear, false);
	const book = findBook(bookElement[BOOK_ITEMID]);

	book.isFinished = false;
	newBook[BOOK_ITEMID] = book.id;

	unfinishedList.append(newBook);
	bookElement.remove();
	updateStorageData();
};

const removeBook = (bookElement) => {
	const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);

	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Delete Book',
		buttonsStyling: false,
		reverseButtons: true,
		customClass: {
			cancelButton: 'btn cancel-btn swal-btn',
			confirmButton: 'btn remove-btn swal-btn',
		},
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: 'Deleted!',
				text: 'Book deleted from the shelf!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'btn finished-btn swal-btn',
				},
			});

			books.splice(bookPosition, 1);
			bookElement.remove();
			updateStorageData();
		}
	});
};

const searchBookByTitle = () => {
	let searchBookInput = document.querySelector('#searchForm input');
	const unfinishedBooks = document.querySelectorAll('.unfinished-list .card');
	const finishedBooks = document.querySelectorAll('.finished-list .card');

	finishedBooks.forEach((e) => e.remove());
	unfinishedBooks.forEach((e) => e.remove());

	searchBooks(searchBookInput);
};

const createFinishedBtn = () => {
	return createBtn('finished-btn', false, (event) => {
		moveToFinished(event.target.parentElement.parentElement);
	});
};

const createUnfinishedBtn = () => {
	return createBtn('unfinished-btn', true, (event) => {
		moveToUnfinished(event.target.parentElement.parentElement);
	});
};

const createRemoveBtn = () => {
	return createBtn('remove-btn', true, (event) => {
		removeBook(event.target.parentElement.parentElement);
	});
};

const maxYear = () => {
	const publishedInput = document.getElementById('published');
	const date = new Date();
	const year = date.getFullYear();

	publishedInput.setAttribute('min', 0);
	publishedInput.setAttribute('max', year);
};

const unfinishedAccordion = () => {
	const unfinishedArrow = document.querySelector('.unfinished-accordion-btn');
	unfinishedArrow.addEventListener('click', () => {
		unfinishedArrow.classList.toggle('fa-chevron-down');
		unfinishedArrow.classList.toggle('fa-chevron-up');
	});
};

const finishedAccordion = () => {
	const finishedArrow = document.querySelector('.finished-accordion-btn');
	finishedArrow.addEventListener('click', () => {
		finishedArrow.classList.toggle('fa-chevron-down');
		finishedArrow.classList.toggle('fa-chevron-up');
	});
};

const backToTop = () => {
	window.scrollTo({
		top: 0,
		left: 0,
	});
};
