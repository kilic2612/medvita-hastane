import { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

/** Fotoğraf yüklenemezse baş harflerle gradyan avatar gösterir. */
export function Avatar({ src, name, className = '' }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  if (!src || failed) {
    return (
      <span className={`grid place-items-center bg-linear-to-br from-brand to-accent font-bold text-white ${className}`} aria-label={name}>
        {initials}
      </span>
    );
  }

  return <img src={src} alt={name} loading="lazy" decoding="async" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
