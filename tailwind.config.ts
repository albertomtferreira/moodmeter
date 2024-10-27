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
			keyframes: {
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
				}
			},
			animation: {
				shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
			},
		},
	},
	plugins: [],
}