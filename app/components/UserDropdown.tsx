import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bug, LogOut, User as UserIcon } from 'lucide-react';

type User = {
  profilePic?: string;
  name: string;
};

type UserDropdownProps = {
  user: User;
  onLogout: () => void;
};

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };
  const handlemy_IssuesClick = () => {
    setIsOpen(false);
    navigate('/my_Issues');
  };
  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
        aria-label="User menu"
      >
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[var(--primary)]/10 flex items-center justify-center">
            <span className="text-[var(--primary)] font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">
              {user.name}
            </p>
          </div>

          <button
            onClick={handleProfileClick}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
          >
            <UserIcon className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={handlemy_IssuesClick}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
          >
            <Bug className="h-4 w-4" />
            My Issues
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}