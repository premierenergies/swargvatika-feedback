
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Swarg Vatika Trust. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Making a difference with your support
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
