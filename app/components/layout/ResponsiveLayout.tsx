'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface ResponsiveLayoutProps {
  children: ReactNode;
  editorContent: ReactNode;
  previewContent: ReactNode;
}

type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'wide';

const getScreenSize = (): ScreenSize => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'desktop';
  return 'wide';
};

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  editorContent,
  previewContent,
}) => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [activePanel, setActivePanel] = useState<'editor' | 'preview'>('editor');
  const { settings } = useAccessibility();

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isDesktop = screenSize === 'desktop';
  const isWide = screenSize === 'wide';

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <header 
          id="navigation" 
          className="bg-bg-secondary border-b border-primary-neon/20"
          role="banner"
        >
          {children}
        </header>
        
        <main 
          id="main-content" 
          className="flex-1 overflow-hidden"
          role="main"
          aria-label="Google Slides batchUpdate Builder"
        >
          <div className="h-full">
            {activePanel === 'editor' ? (
              <section 
                id="editor" 
                className="h-full overflow-auto p-4"
                role="region"
                aria-label="Element Editor Panel"
              >
                {editorContent}
              </section>
            ) : (
              <section 
                id="preview" 
                className="h-full overflow-auto p-4"
                role="region"
                aria-label="Preview Panel"
              >
                {previewContent}
              </section>
            )}
          </div>
        </main>

        <MobileNavigation 
          activePanel={activePanel} 
          onPanelChange={setActivePanel} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header 
        id="navigation" 
        className="bg-bg-secondary border-b border-primary-neon/20"
        role="banner"
      >
        {children}
      </header>
      
      <main 
        id="main-content" 
        className={`flex-1 overflow-hidden ${
          isWide ? 'max-w-[1920px] mx-auto w-full' : ''
        }`}
        role="main"
        aria-label="Google Slides batchUpdate Builder"
      >
        <div className={`h-full grid ${
          isTablet ? 'grid-cols-2 gap-6 p-6' :
          isDesktop ? 'grid-cols-[400px_1fr] gap-8 p-8' :
          'grid-cols-[480px_1fr_300px] gap-8 p-10'
        }`}>
          <section 
            id="editor" 
            className="overflow-auto"
            role="region"
            aria-label="Element Editor Panel"
          >
            {editorContent}
          </section>
          
          <section 
            id="preview" 
            className="overflow-auto"
            role="region"
            aria-label="Preview Panel"
          >
            {previewContent}
          </section>
          
          {isWide && (
            <aside 
              className="overflow-auto"
              role="complementary"
              aria-label="Additional Tools"
            >
              <AccessibilityPanel />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

interface MobileNavigationProps {
  activePanel: 'editor' | 'preview';
  onPanelChange: (panel: 'editor' | 'preview') => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activePanel, 
  onPanelChange 
}) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-primary-neon/20 z-50"
      role="navigation"
      aria-label="Panel Navigation"
    >
      <div className="flex justify-around">
        <button
          onClick={() => onPanelChange('editor')}
          className={`flex-1 py-4 px-6 text-center touch-target focus-indicator ${
            activePanel === 'editor' 
              ? 'bg-primary-neon/10 text-primary-neon border-t-2 border-primary-neon' 
              : 'text-text-secondary hover:bg-primary-neon/5'
          }`}
          aria-current={activePanel === 'editor' ? 'page' : undefined}
          aria-label="Switch to Editor Panel"
        >
          <span className="block text-sm font-medium">Editor</span>
        </button>
        
        <button
          onClick={() => onPanelChange('preview')}
          className={`flex-1 py-4 px-6 text-center touch-target focus-indicator ${
            activePanel === 'preview' 
              ? 'bg-primary-neon/10 text-primary-neon border-t-2 border-primary-neon' 
              : 'text-text-secondary hover:bg-primary-neon/5'
          }`}
          aria-current={activePanel === 'preview' ? 'page' : undefined}
          aria-label="Switch to Preview Panel"
        >
          <span className="block text-sm font-medium">Preview</span>
        </button>
      </div>
    </nav>
  );
};

const AccessibilityPanel: React.FC = () => {
  const { settings, updateSetting } = useAccessibility();

  return (
    <div className="p-4 bg-bg-secondary rounded-lg border border-primary-neon/20">
      <h2 className="text-lg font-semibold mb-4">Accessibility Settings</h2>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between touch-target">
          <span className="text-sm">High Contrast</span>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSetting('highContrast', e.target.checked)}
            className="w-5 h-5 focus-indicator"
            aria-label="Toggle high contrast mode"
          />
        </label>
        
        <label className="flex items-center justify-between touch-target">
          <span className="text-sm">Reduced Motion</span>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
            className="w-5 h-5 focus-indicator"
            aria-label="Toggle reduced motion"
          />
        </label>
        
        <label className="flex items-center justify-between touch-target">
          <span className="text-sm">Large Text</span>
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={(e) => updateSetting('largeText', e.target.checked)}
            className="w-5 h-5 focus-indicator"
            aria-label="Toggle large text mode"
          />
        </label>
        
        <label className="flex items-center justify-between touch-target">
          <span className="text-sm">Keyboard Hints</span>
          <input
            type="checkbox"
            checked={settings.keyboardNavigationHints}
            onChange={(e) => updateSetting('keyboardNavigationHints', e.target.checked)}
            className="w-5 h-5 focus-indicator"
            aria-label="Toggle keyboard navigation hints"
          />
        </label>
      </div>
      
      <div className="mt-4 pt-4 border-t border-primary-neon/10">
        <p className="text-xs text-text-muted">
          Press <kbd className="px-1 py-0.5 bg-bg-primary rounded text-xs">F1</kbd> for keyboard shortcuts
        </p>
      </div>
    </div>
  );
};