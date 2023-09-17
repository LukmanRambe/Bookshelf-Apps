/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./*.html', './**/*.js'],
	theme: {
		extend: {
			colors: {
				'--white': 'var(--white)',
				'--light-blue': 'var(--light-blue)',
				'--blue': 'var(--blue)',
				'--dark-blue': 'var(--dark-blue)',
				'--orange': 'var(--orange)',
				'--green': 'var(--green)',
				'--light-green': 'var(--light-green)',
				'--yellow': 'var(--yellow)',
				'--red': 'var(--red)',
			},
		},
	},
	plugins: [],
};
