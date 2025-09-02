'use client';

import { useState, useCallback } from 'react';
import { createShapeService } from '@/services/createShape';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import type { ElementType } from '@/components/editor/ElementToolbar';

export function useElementCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const { addRequest } = useBatchUpdateStore();

  const createElement = useCallback(async (
    elementType: ElementType,
    position?: { x: number; y: number },
    size?: { width: number; height: number }
  ) => {
    setIsCreating(true);
    try {
      const request = createShapeService.createElement(elementType, position, size);
      
      if (Array.isArray(request)) {
        request.forEach(req => addRequest(req));
      } else {
        addRequest(request);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create element:', error);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [addRequest]);

  return {
    createElement,
    isCreating,
    createShapeService
  };
}