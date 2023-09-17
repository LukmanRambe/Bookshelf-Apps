const addBookModalBtn = document.querySelector('#add-btn');
const addBookModal = document.querySelector('#add-book-modal');
addBookModalBtn.addEventListener('click', () => {
	addBookModal.classList.remove('hidden');
});

const cancelModalBtn = document.querySelector('#cancel-btn');
cancelModalBtn.addEventListener('click', () => {
	addBookModal.classList.add('hidden');
});

const unfinishedList = document.querySelector('.unfinished-list');
const finishedList = document.querySelector('.finished-list');
const BOOK_ITEMID = 'itemId';

const addBook = () => {
	const addBookForm = document.getElementById('addBookForm');
	const bookTitle = document.getElementById('title');
	const bookAuthor = document.getElementById('author');
	const bookPublishedYear = document.getElementById('published');
	const publishedYearFirstNumber = bookPublishedYear.value.split('')[0];

	if (bookTitle.value !== '' && bookAuthor.value !== '' && +bookPublishedYear.value) {
		if (publishedYearFirstNumber !== 0) {
			const book = makeBook(bookTitle.value, bookAuthor.value, +bookPublishedYear.value);
			const bookObject = composeBookObject(bookTitle.value, bookAuthor.value, +bookPublishedYear.value, false);

			book[BOOK_ITEMID] = bookObject.id;
			books.push(bookObject);

			addBookForm.reset();
			unfinishedList.append(book);
			updateStorageData();

			Swal.fire({
				title: 'Success!',
				text: 'Book added to the shelf!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: '!w-fit finished-btn',
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
					confirmButton: 'finished-btn',
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
				confirmButton: 'finished-btn',
			},
		});
	}
};

const makeBook = (title, author, publishedYear, isFinished) => {
	const bookDetails = document.createElement('article');
	const className = [
		'book',
		'text-base',
		'w-full',
		'sm:min-w-[20rem]',
		'sm:max-w-[20rem]',
		'lg:min-w-full',
		'h-fit',
		'capitalize',
		'flex',
		'flex-col',
		'border-2',
		'-border--blue',
		'rounded-md',
		'py-4',
		'px-3',
	];
	bookDetails.classList.add(...className);
	bookDetails.innerHTML = `
	<h5 class='title text-2xl font-bold mb-4'>${title}<h5>
	<article class="flex flex-col gap-1">
		<span class='author capitalize'>Author : ${author}</span>
		<span class='published'>Published : ${publishedYear}</span>
	</article>	
		`;

	const actionBtnContainer = document.createElement('div');
	const actionBtnClassName = ['w-full', 'h-full', 'flex', 'flex-col', 'sm:flex-row', 'justify-end', 'gap-4', 'mt-12'];
	actionBtnContainer.classList.add(...actionBtnClassName);

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
	button.classList.add(classType);

	if (!isFinished && classType === 'finished-btn') {
		button.innerText = `Finished`;
	} else if (isFinished && classType === 'unfinished-btn') {
		button.innerText = `Unfinished`;
	} else if (classType == 'remove-btn') {
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

	const newBook = makeBook(title, author, +publishedYear, true);
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

	const newBook = makeBook(title, author, +publishedYear, false);
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
			actions: 'swal-actions',
			cancelButton: 'cancel-btn',
			confirmButton: 'remove-btn',
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
					actions: 'swal-actions',
					confirmButton: 'finished-btn',
				},
			});

			books.splice(bookPosition, 1);
			bookElement.remove();
			updateStorageData();
		}
	});
};

const searchBookByTitle = () => {
	let bookTitle = document.querySelector('#search-title');
	const unfinishedBooks = document.querySelectorAll('.unfinished-list .book');
	const finishedBooks = document.querySelectorAll('.finished-list .book');

	finishedBooks.forEach((e) => e.remove());
	unfinishedBooks.forEach((e) => e.remove());

	searchBooks(bookTitle);
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

	publishedInput.setAttribute('min', 1);
	publishedInput.setAttribute('max', year);
};

const unfinishedAccordion = () => {
	const unfinishedArrow = document.querySelector('.unfinished-accordion-btn i');
	const unfinishedBooksList = document.querySelector('.unfinished-list');
	unfinishedArrow.addEventListener('click', () => {
		unfinishedArrow.classList.toggle('fa-chevron-down');
		unfinishedArrow.classList.toggle('fa-chevron-up');

		if (unfinishedBooksList.classList.contains('opacity-100')) {
			unfinishedBooksList.classList.remove('opacity-100');
			unfinishedBooksList.classList.add('opacity-0');

			unfinishedBooksList.classList.add('-translate-y-2');
			unfinishedBooksList.classList.remove('translate-y-0');

			const timeoutId = setTimeout(() => {
				unfinishedBooksList.classList.add('hidden');
			}, 300);

			return () => clearTimeout(timeoutId);
		} else {
			unfinishedBooksList.classList.remove('hidden');

			const timeoutId = setTimeout(() => {
				unfinishedBooksList.classList.add('opacity-100');
				unfinishedBooksList.classList.remove('opacity-0');

				unfinishedBooksList.classList.remove('-translate-y-2');
				unfinishedBooksList.classList.add('translate-y-0');
			}, 200);

			return () => clearTimeout(timeoutId);
		}
	});
};

const finishedAccordion = () => {
	const finishedArrow = document.querySelector('.finished-accordion-btn i');
	const finishedBooksList = document.querySelector('.finished-list');
	finishedArrow.addEventListener('click', () => {
		finishedArrow.classList.toggle('fa-chevron-down');
		finishedArrow.classList.toggle('fa-chevron-up');

		if (finishedBooksList.classList.contains('opacity-100')) {
			finishedBooksList.classList.remove('opacity-100');
			finishedBooksList.classList.add('opacity-0');

			finishedBooksList.classList.add('-translate-y-2');
			finishedBooksList.classList.remove('translate-y-0');

			const timeoutId = setTimeout(() => {
				finishedBooksList.classList.add('hidden');
			}, 300);

			return () => clearTimeout(timeoutId);
		} else {
			finishedBooksList.classList.remove('hidden');

			const timeoutId = setTimeout(() => {
				finishedBooksList.classList.add('opacity-100');
				finishedBooksList.classList.remove('opacity-0');

				finishedBooksList.classList.remove('-translate-y-2');
				finishedBooksList.classList.add('translate-y-0');
			}, 200);

			return () => clearTimeout(timeoutId);
		}
	});
};

const backToTop = () => {
	window.scrollTo({
		top: 0,
		left: 0,
	});
};
