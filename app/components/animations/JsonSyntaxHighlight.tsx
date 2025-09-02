'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface JsonSyntaxHighlightProps {
  json: unknown;
  isValid?: boolean;
  highlightErrors?: boolean;
  className?: string;
}

export function JsonSyntaxHighlight({
  json,
  isValid = true,
  highlightErrors = true,
  className
}: JsonSyntaxHighlightProps) {
  const [highlightedJson, setHighlightedJson] = useState('');
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const syntaxHighlight = (json: unknown): string => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match: string) => {
        let cls = 'syntax-number syntax-highlight-transition';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'syntax-keyword syntax-highlight-transition';
          } else {
            cls = 'syntax-string syntax-highlight-transition';
          }
        } else if (/true|false/.test(match)) {
          cls = 'syntax-boolean syntax-highlight-transition';
        } else if (/null/.test(match)) {
          cls = 'syntax-null syntax-highlight-transition';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  useEffect(() => {
    const highlighted = syntaxHighlight(json);
    setHighlightedJson(highlighted);

    if (isValid && !prefersReducedMotion) {
      setAnimateSuccess(true);
      const timer = setTimeout(() => {
        setAnimateSuccess(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [json, isValid, prefersReducedMotion]);

  const containerClass = useMemo(() => {
    const classes = [
      'p-4 rounded-glass bg-bg-tertiary/50 overflow-auto',
      'font-mono text-code'
    ];

    if (!isValid && highlightErrors) {
      classes.push('border-2 border-error/50');
      if (!prefersReducedMotion) {
        classes.push('syntax-error');
      }
    } else if (animateSuccess) {
      classes.push('syntax-highlight-success');
    }

    return cn(...classes, className);
  }, [isValid, highlightErrors, animateSuccess, prefersReducedMotion, className]);

  return (
    <div className={containerClass}>
      <pre
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

interface SyntaxTransitionWrapperProps {
  children: React.ReactNode;
  isValid: boolean;
  className?: string;
}

export function SyntaxTransitionWrapper({
  children,
  isValid,
  className
}: SyntaxTransitionWrapperProps) {
  const [validationClass, setValidationClass] = useState('');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      if (isValid) {
        setValidationClass('validation-flash-success');
        const timer = setTimeout(() => setValidationClass(''), 150);
        return () => clearTimeout(timer);
      } else {
        setValidationClass('validation-flash-error');
        const timer = setTimeout(() => setValidationClass(''), 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isValid, prefersReducedMotion]);

  return (
    <div className={cn(validationClass, className)}>
      {children}
    </div>
  );
}