
import {
  LayoutDashboard,
  Activity,
  GitMerge,
  Briefcase,
  Boxes,
  ClipboardList,
  ArrowRightLeft,
  RotateCcw,
  CircleDot,
} from 'lucide-react';

/**
 * Registry mapping backend string keys to Lucide React components.
 */
const ICON_REGISTRY = {
  LayoutDashboard: LayoutDashboard,
  Activity: Activity,
  GitMerge: GitMerge,
  Briefcase: Briefcase,
  Boxes: Boxes,
  ClipboardList: ClipboardList,
  ArrowRightLeft: ArrowRightLeft,
  RotateCcw: RotateCcw,
};

/**
 * Returns a React Icon element mapped from the backend string name.
 * Fallbacks to CircleDot if the icon name is missing or unrecognized.
 *
 * @param {string} iconName - String name from backend API (e.g., "Boxes")
 * @param {string} className - Optional Tailwind CSS class string (e.g., "w-5 h-5")
 * @returns {JSX.Element}
 */
export const renderMenuIcon = (iconName, className = 'w-5 h-5') => {
  const IconComponent = ICON_REGISTRY[iconName] || CircleDot;
  return <IconComponent className={className} />;
};