/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				'hanken-grotesk': [
					'Hanken Grotesk',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Ubuntu',
					'Oxygen',
					'Cantarell',
					'Fira Sans',
					'Droid Sans',
					'Helvetica Neue',
					'sans-serif'
				]
			}
		}
	},
	plugins: [require('@tailwindcss/line-clamp')]
}
