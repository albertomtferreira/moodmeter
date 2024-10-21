const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				tertiary: 'var(--color-tertiary)',
				background: 'var(--color-background)',
				text: 'var(--color-text)',
			},
			fontFamily: {
				sans: ['Nunito', ...fontFamily.sans],
			},
		},
	},
	plugins: [],
}