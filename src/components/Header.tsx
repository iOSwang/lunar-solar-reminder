
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, showBackButton = true }) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
    </div>
  );
};

export default Header;
