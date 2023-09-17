window.addEventListener('DOMContentLoaded', () => {
	const addBookForm = document.getElementById('addBookForm');
	addBookForm.addEventListener('submit', (event) => {
		event.preventDefault();
		addBook();
	});

	const searchForm = document.getElementById('search-form');
	searchForm.addEventListener('submit', (event) => {
		event.preventDefault();
		searchBookByTitle();
	});

	const backToTopBtn = document.querySelector('.back-to-top');
	backToTopBtn.addEventListener('click', () => {
		backToTop();
	});

	window.addEventListener('scroll', () => {
		const scrollHeight = window.scrollY;

		if (scrollHeight > 450) {
			backToTopBtn.classList.remove('hidden');
		} else {
			backToTopBtn.classList.add('hidden');
		}
	});

	maxYear();
	unfinishedAccordion();
	finishedAccordion();

	if (isStorageExist()) {
		loadStorageData();
	}
});

document.addEventListener('ondatasaved', () => {
	console.log('Data berhasil disimpan');
});

document.addEventListener('ondataloaded', () => {
	console.log('Data berhasil dimuat');
	refreshDataFromBooks();
});
