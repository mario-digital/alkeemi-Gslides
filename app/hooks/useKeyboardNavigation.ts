import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: () => void;
  description: string;
}

interface UseKeyboardNavigationOptions {
  shortcuts?: KeyboardShortcut[];
  enableArrowNavigation?: boolean;
  enableTabTrapping?: boolean;
  trapContainer?: HTMLElement | null;
}

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}) => {
  const {
    shortcuts = [],
    enableArrowNavigation = false,
    enableTabTrapping = false,
    trapContainer = null,
  } = options;

  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef(0);

  const getFocusableElements = useCallback((container: HTMLElement = document.body): HTMLElement[] => {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(',');

    return Array.from(container.querySelectorAll<HTMLElement>(selector))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      });
  }, []);

  const handleArrowNavigation = useCallback((event: KeyboardEvent) => {
    if (!enableArrowNavigation) return;

    const container = trapContainer || document.body;
    focusableElementsRef.current = getFocusableElements(container);
    
    if (focusableElementsRef.current.length === 0) return;

    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElementsRef.current.indexOf(currentElement);

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % focusableElementsRef.current.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = focusableElementsRef.current.length - 1;
        break;
      default:
        return;
    }

    focusableElementsRef.current[nextIndex]?.focus();
    currentFocusIndexRef.current = nextIndex;
  }, [enableArrowNavigation, trapContainer, getFocusableElements]);

  const handleTabTrapping = useCallback((event: KeyboardEvent) => {
    if (!enableTabTrapping || !trapContainer || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(trapContainer);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }, [enableTabTrapping, trapContainer, getFocusableElements]);

  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesCtrl = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : true;
      const matchesShift = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
      const matchesAlt = shortcut.altKey ? event.altKey : !event.altKey;
      const matchesMeta = shortcut.metaKey ? event.metaKey : !event.metaKey;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        event.preventDefault();
        shortcut.handler();
        break;
      }
    }
  }, [shortcuts]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
      const activeDropdown = document.querySelector('[role="menu"]:not([aria-hidden="true"])');
      
      if (activeModal) {
        const closeButton = activeModal.querySelector('[aria-label*="close" i], [aria-label*="dismiss" i]') as HTMLElement;
        closeButton?.click();
      } else if (activeDropdown) {
        const trigger = document.querySelector('[aria-expanded="true"]') as HTMLElement;
        trigger?.click();
      }
    }
  }, []);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region') || createLiveRegion(priority);
    liveRegion.textContent = message;
    
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }, []);

  const createLiveRegion = (priority: 'polite' | 'assertive'): HTMLElement => {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return region;
  };

  const registerHelpShortcut = useCallback(() => {
    const helpShortcut: KeyboardShortcut = {
      key: 'F1',
      handler: () => {
        const helpText = shortcuts
          .map(s => `${s.key}${s.ctrlKey ? ' + Ctrl' : ''}${s.shiftKey ? ' + Shift' : ''}: ${s.description}`)
          .join(', ');
        announceToScreenReader(`Available keyboard shortcuts: ${helpText}`, 'assertive');
      },
      description: 'Show keyboard shortcuts help',
    };
    return helpShortcut;
  }, [shortcuts, announceToScreenReader]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyboardShortcuts(event);
      handleArrowNavigation(event);
      handleTabTrapping(event);
      handleEscapeKey(event);
    };

    const allShortcuts = [...shortcuts];
    if (shortcuts.length > 0) {
      allShortcuts.push(registerHelpShortcut());
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleKeyboardShortcuts,
    handleArrowNavigation,
    handleTabTrapping,
    handleEscapeKey,
    shortcuts,
    registerHelpShortcut,
  ]);

  return {
    announceToScreenReader,
    getFocusableElements,
    currentFocusIndex: currentFocusIndexRef.current,
  };
};

export const useGlobalKeyboardShortcuts = () => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'e',
      ctrlKey: true,
      handler: () => {
        const exportButton = document.querySelector('[aria-label*="export" i]') as HTMLElement;
        exportButton?.click();
      },
      description: 'Export batchUpdate JSON',
    },
    {
      key: 'i',
      ctrlKey: true,
      handler: () => {
        const importButton = document.querySelector('[aria-label*="import" i]') as HTMLElement;
        importButton?.click();
      },
      description: 'Import batchUpdate JSON',
    },
    {
      key: 's',
      ctrlKey: true,
      handler: () => {
        const saveButton = document.querySelector('[aria-label*="save" i]') as HTMLElement;
        saveButton?.click();
      },
      description: 'Save current work',
    },
    {
      key: 'n',
      ctrlKey: true,
      handler: () => {
        const newButton = document.querySelector('[aria-label*="new" i], [aria-label*="create" i]') as HTMLElement;
        newButton?.click();
      },
      description: 'Create new element',
    },
    {
      key: '/',
      ctrlKey: true,
      handler: () => {
        const searchInput = document.querySelector('input[type="search"], input[aria-label*="search" i]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search',
    },
  ];

  return useKeyboardNavigation({ shortcuts });
};