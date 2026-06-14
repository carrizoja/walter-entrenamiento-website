import { useState, useEffect } from 'react';

export default function ThemeToggle() {
const [theme, setTheme] = useState<'light' | 'dark'>('light');
const [mounted, setMounted] = useState(false);

// Load theme from localStorage on mount
useEffect(() => {
setMounted(true);
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
setTheme(initialTheme);

// Apply theme
applyTheme(initialTheme);
}, []);

// Function to apply theme
const applyTheme = (newTheme: 'light' | 'dark') => {
const html = document.documentElement;
if (newTheme === 'dark') {
html.classList.add('dark');
} else {
html.classList.remove('dark');
}
};

// Toggle theme
const toggleTheme = () => {
const newTheme = theme === 'light' ? 'dark' : 'light';

// Temporarily add transition class for smooth switch
document.documentElement.classList.add('theme-transitioning');
setTheme(newTheme);
localStorage.setItem('theme', newTheme);
applyTheme(newTheme);
setTimeout(() => {
  document.documentElement.classList.remove('theme-transitioning');
}, 400);
};

	// Prevent flash of unstyled content
	if (!mounted) {
		return (
			<button
				className="relative w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"
				aria-label="Toggle theme"
				disabled
			>
				<div className="w-6 h-6 rounded-full bg-white absolute top-1 left-1" />
			</button>
		);
	}

	return (
		<button
			onClick={toggleTheme}
			type="button"
			className={`relative w-16 h-8 rounded-full transition-all duration-300 cursor-pointer ${
				theme === 'light' 
					? 'bg-gray-200 hover:bg-gray-300' 
					: 'bg-gray-800 hover:bg-gray-700'
			}`}
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
			title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			{/* Toggle Track */}
			<div className="absolute inset-0 rounded-full overflow-hidden">
				{/* Icons positioned in the track */}
				<div className="absolute left-2 top-1/2 -translate-y-1/2">
					{/* Sun Icon (always visible on left in light mode) */}
					<svg
						className={`w-4 h-4 transition-colors duration-300 ${
							theme === 'light' ? 'text-white' : 'text-gray-500'
						}`}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
					</svg>
				</div>
				<div className="absolute right-2 top-1/2 -translate-y-1/2">
					{/* Moon Icon (always visible on right in dark mode) */}
					<svg
						className={`w-4 h-4 transition-colors duration-300 ${
							theme === 'dark' ? 'text-white' : 'text-gray-400'
						}`}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				</div>
			</div>

			{/* Toggle Circle/Slider */}
			<div
				className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
					theme === 'light' 
						? 'left-1 bg-[#FF6B35]' 
						: 'left-9 bg-[#FF6B35]'
				}`}
			>
				{/* Icon inside the toggle circle */}
				{theme === 'light' ? (
					<svg
						className="w-3.5 h-3.5 text-white"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
					</svg>
				) : (
					<svg
						className="w-3.5 h-3.5 text-white"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				)}
			</div>
		</button>
	);
}