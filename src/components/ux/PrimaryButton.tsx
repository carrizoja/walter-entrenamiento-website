import React from 'react';

export interface PrimaryButtonProps {
  href?: string;
  text: string;
  icon?: 'whatsapp' | 'instagram' | 'arrow';
  variant?: 'primary' | 'secondary' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  target?: '_blank' | '_self';
  rel?: string;
  className?: string;
  id?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  href,
  text,
  icon,
  variant = 'primary',
  size = 'md',
  target = '_self',
  rel,
  className = '',
  id,
  ariaLabel,
  onClick
}) => {
  // Base classes — shared across all variants
  const baseClasses =
    'btn-shimmer relative inline-flex items-center justify-center font-montserrat font-bold rounded-xl ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#FF6B35] ' +
    'transition-all duration-300 ease-out select-none';

  // Size variations — md/lg meet the 44px touch target, sm is desktop-only
  const sizeClasses: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-3 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  // Icon glyph sizes scale with button size
  const iconClasses: Record<string, { default: string; arrow: string }> = {
    sm: { default: 'w-3.5 h-3.5', arrow: 'w-3 h-3' },
    md: { default: 'w-4 h-4', arrow: 'w-3.5 h-3.5' },
    lg: { default: 'w-5 h-5', arrow: 'w-4 h-4' },
  };

  const iconClass = iconClasses[size].default;
  const arrowClass = iconClasses[size].arrow;

  // Variant styles — each has a unique personality
  const variantClasses: Record<string, string> = {
    // Primary: brand orange gradient with glow on hover
    primary:
      'bg-gradient-to-r from-[#FF6B35] to-[#C83B08] text-white ' +
      'shadow-[0_2px_12px_rgba(255,107,53,0.30)] ' +
      'hover:shadow-[0_4px_24px_rgba(255,107,53,0.50)] ' +
      'hover:from-[#FF7A45] hover:to-[#D44010] ' +
      'hover:scale-[1.03] active:scale-[0.97]',

    // Secondary: clean outlined style, fills on hover
    secondary:
      'bg-transparent border-2 border-[#701D2A] dark:border-white/70 ' +
      'text-[#701D2A] dark:text-white ' +
      'hover:bg-[#701D2A] hover:text-white hover:border-[#701D2A] ' +
      'dark:hover:bg-white dark:hover:text-[#701D2A] dark:hover:border-white ' +
      'hover:scale-[1.03] active:scale-[0.97] ' +
      'hover:shadow-[0_4px_16px_rgba(112,29,42,0.30)] dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.15)]',

    // WhatsApp: rich green gradient with a pulse ring effect
    whatsapp:
      'bg-gradient-to-r from-[#1fbe5e] to-[#128C7E] text-white ' +
      'shadow-[0_2px_12px_rgba(37,211,102,0.30)] ' +
      'hover:shadow-[0_4px_24px_rgba(37,211,102,0.55)] ' +
      'hover:from-[#25D366] hover:to-[#1a9e71] '
  };

  // Icon SVG components
  const IconComponent = ({ iconType }: { iconType: string }) => {
    switch (iconType) {
      case 'whatsapp':
        return (
          <svg
            className={`${iconClass} shrink-0`}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg
            className={`${iconClass} shrink-0`}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'arrow':
        return (
          <svg
            className={`${arrowClass} shrink-0 transition-transform duration-300 group-hover:translate-x-1`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        );
      default:
        return null;
    }
  };

  const allClasses = `group ${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();

  const commonProps = {
    className: allClasses,
    id,
    'aria-label': ariaLabel,
    onClick,
  };

  const content = (
    <>
      {icon && icon !== 'arrow' && <IconComponent iconType={icon} />}
      <span>{text}</span>
      {icon === 'arrow' && <IconComponent iconType={icon} />}
      {/* Arrow auto-appended for secondary when no icon specified */}
      {!icon && variant === 'secondary' && (
        <svg
          className={`${arrowClass} shrink-0 transition-transform duration-300 group-hover:translate-x-1`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...commonProps}>
      {content}
    </button>
  );
};

export default PrimaryButton;
