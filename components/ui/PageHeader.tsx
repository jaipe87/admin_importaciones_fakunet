
import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <h1 className="text-2xl font-bold text-fakunet-main">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};
