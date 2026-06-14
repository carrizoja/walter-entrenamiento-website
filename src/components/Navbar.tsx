import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import PrimaryButton from './ux/PrimaryButton';
import logo from '../assets/logo.png';

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activePath, setActivePath] = useState('/');

	// Detect scroll for glassmorphism effect
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// Detect active page
	useEffect(() => {
		setActivePath(window.location.pathname);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(prev => !prev);
	};

	const navigationLinks = [
		{ href: '/', label: 'Inicio' },
		{ href: '/sobre-walter', label: 'Sobre Walter' },
		{ href: '/servicios', label: 'Servicios' },
		{ href: '/bienestar', label: 'Bienestar' },
		{ href: '/galeria', label: 'Galería' },
		{ href: '/contacto', label: 'Contacto' },
	];

	// Active link detection
	const isActive = (href: string) => {
		if (href === '/') return activePath === '/';
		return activePath === href || activePath.startsWith(href + '/');
	};

	return (
		<>
			<nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
					scrolled
						? 'bg-white/90 dark:bg-[#0f0508]/90 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_24px_rgba(0,0,0,0.4)]'
						: 'bg-white/70 dark:bg-transparent backdrop-blur-sm'
				}`}
				aria-label="Navegación principal"
			>
				{/* Top accent line — brand gradient */}
				<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B35] via-[#C83B08] to-[#701D2A]" aria-hidden="true" />

				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="flex items-center justify-between h-20">
						{/* Logo */}
						<a
							href="/"
							className="flex items-center space-x-3 group shrink-0"
							aria-label="Walter Entrenamiento — Inicio"
						>
							<div className="w-14 h-14 rounded-xl overflow-hidden transition-all duration-300">
								<img
									src={logo.src}
									alt=""
									className="w-full h-full object-contain"
									width="56"
									height="56"
								/>
							</div>
						</a>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-1">
							{navigationLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className={`relative px-3 py-2 font-quicksand font-semibold text-[0.925rem] rounded-lg transition-all duration-300 group ${
										isActive(link.href)
											? 'text-[#FF6B35]'
											: 'text-gray-700 dark:text-gray-200 hover:text-[#FF6B35] dark:hover:text-[#FF6B35]'
									}`}
								>
									{link.label}
									{/* Animated underline indicator */}
									<span
										className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#FF6B35] to-[#C83B08] transition-all duration-300 origin-left ${
											isActive(link.href)
												? 'scale-x-100 opacity-100'
												: 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
										}`}
										aria-hidden="true"
									/>
								</a>
							))}
						</div>

						{/* Right side: theme toggle + CTA */}
						<div className="hidden lg:flex items-center gap-4">
							<ThemeToggle />
							<PrimaryButton
								href="https://wa.me/5491168271296"
								text="Reservar Clase"
								icon="whatsapp"
								variant="whatsapp"
								size="sm"
								target="_blank"
								rel="noopener noreferrer"
							/>
						</div>

						{/* Mobile: theme toggle + hamburger */}
						<div className="lg:hidden flex items-center gap-2">
							<ThemeToggle />
							<button
								onClick={toggleMobileMenu}
								className="relative p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-all duration-300"
								aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
								aria-expanded={isMobileMenuOpen}
								aria-controls="mobile-menu"
							>
								<span className="sr-only">{isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
								{/* Animated hamburger icon */}
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									{isMobileMenuOpen ? (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									) : (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu — smooth slide down */}
				<div
					id="mobile-menu"
					className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
						isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
					}`}
					aria-hidden={!isMobileMenuOpen}
				>
					<div className="bg-white/95 dark:bg-[#0f0508]/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 px-6 pt-4 pb-6 space-y-1">
						{navigationLinks.map((link, index) => (
							<a
								key={link.href}
								href={link.href}
								className={`flex items-center justify-between px-4 py-3 rounded-xl font-quicksand font-semibold text-base transition-all duration-300 ${
									isActive(link.href)
										? 'bg-[#FF6B35]/10 text-[#FF6B35]'
										: 'text-gray-700 dark:text-gray-200 hover:bg-[#FF6B35]/8 hover:text-[#FF6B35] dark:hover:text-[#FF6B35]'
								}`}
								style={{ transitionDelay: isMobileMenuOpen ? `${index * 40}ms` : '0ms' }}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{link.label}
								{isActive(link.href) && (
									<span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" aria-hidden="true" />
								)}
							</a>
						))}

						<div className="pt-3 pb-1">
							<PrimaryButton
								href="https://wa.me/5491168271296"
								text="Reservar Clase"
								icon="whatsapp"
								variant="whatsapp"
								size="md"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							/>
						</div>
					</div>
				</div>
			</nav>

			{/* Spacer for fixed navbar */}
			<div className="h-20" aria-hidden="true" />
		</>
	);
}
