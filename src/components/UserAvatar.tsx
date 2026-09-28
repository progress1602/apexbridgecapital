import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function getInitials(name?: string | null): string {
  if (!name) return 'U';
  const clean = name.trim();
  if (!clean) return 'U';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function isUserUploadedAvatar(src?: string | null): boolean {
  if (!src || typeof src !== 'string') return false;
  const clean = src.trim();
  if (!clean || clean === 'null' || clean === 'undefined') return false;

  // Reject all external stock photo services and random avatar generators
  const placeholderPatterns = [
    'pravatar.cc',
    'i.pravatar',
    'randomuser.me',
    'images.unsplash.com',
    'unsplash.com',
    'picsum.photos',
    'dicebear.com',
    'placeholder.com',
    'ui-avatars.com',
    'thispersondoesnotexist',
    'xsgames.co',
    'robohash.org',
    'dummyimage.com',
    'placekitten.com',
    'avatar.iran.liara.run'
  ];

  if (placeholderPatterns.some((pattern) => clean.toLowerCase().includes(pattern))) {
    return false;
  }

  // User uploaded avatars are stored as base64 data URLs or blob URLs
  if (clean.startsWith('data:image/') || clean.startsWith('blob:')) {
    return true;
  }

  // Relative uploaded avatar paths if any
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    return true;
  }

  return false;
}

export default function UserAvatar({
  src,
  name,
  size = 'md',
  className,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // ONLY display image if it was actually uploaded by the user
  const isCustomUserUpload = isUserUploadedAvatar(src) && !hasError;

  const sizeStyles = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 26,
    xl: 38,
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center font-bold tracking-tight select-none shrink-0 relative transition-transform',
        sizeStyles[size],
        className
      )}
    >
      {isCustomUserUpload ? (
        <img
          src={src}
          alt={name || 'User Avatar'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-brand-purple/30 via-zinc-900 to-black border border-brand-purple/40 text-brand-purple flex items-center justify-center shadow-inner">
          {initials !== 'U' ? (
            <span className="font-mono font-black uppercase text-white drop-shadow-sm">
              {initials}
            </span>
          ) : (
            <UserIcon size={iconSizes[size]} className="text-brand-purple opacity-90" />
          )}
        </div>
      )}
    </div>
  );
}
