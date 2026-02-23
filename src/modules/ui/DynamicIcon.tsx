import { 
  Zap, ShieldCheck, Headphones, ShoppingCart, Menu, X, User, Settings, 
  Check, Info, AlertCircle, Loader2, Heart, Star, Search, Filter, ArrowRight, ShoppingBag,
  type LucideProps 
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

// Manual mapping to allow tree-shaking (importing 'icons' from lucide-react bundles EVERYTHING)
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Zap, ShieldCheck, Headphones, ShoppingCart, Menu, X, User, Settings,
  Check, Info, AlertCircle, Loader2, Heart, Star, Search, Filter, ArrowRight, ShoppingBag
};

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in ICON_MAP. Please add it to DynamicIcon.tsx`);
    return null; 
  }

  return <IconComponent {...props} />;
};
