'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Save, AlertCircle, Info } from 'lucide-react';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { cn } from '@/lib/utils';

interface FileOperationsManagerProps {
  data: any;
  onDataChange: (data: any) => void;
  className?: string;
  showAutoSave?: boolean;
  autoSaveInterval?: number;
}

export function FileOperationsManager({
  data,
  onDataChange,
  className,
  showAutoSave = true,
  autoSaveInterval = 60000 // 1 minute default
}: FileOperationsManagerProps) {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  // Load recent files from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('alkemy-recent-files');
    if (stored) {
      try {
        setRecentFiles(JSON.parse(stored));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [data]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && hasUnsavedChanges && data) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, autoSaveInterval);

      return () => clearTimeout(timer);
    }
  }, [data, hasUnsavedChanges, autoSaveEnabled, autoSaveInterval]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleAutoSave = useCallback(() => {
    if (!data || !data.requests || data.requests.length === 0) return;

    try {
      const autoSaveKey = 'alkemy-autosave';
      const autoSaveData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(autoSaveKey, JSON.stringify(autoSaveData));
      setLastSaveTime(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [data]);

  const handleImport = useCallback((importedData: any) => {
    onDataChange(importedData);
    setHasUnsavedChanges(false);
    
    // Add to recent files if it has a name
    if (importedData.metadata?.fileName) {
      const updated = [
        importedData.metadata.fileName,
        ...recentFiles.filter(f => f !== importedData.metadata.fileName)
      ].slice(0, 5);
      setRecentFiles(updated);
      localStorage.setItem('alkemy-recent-files', JSON.stringify(updated));
    }
  }, [onDataChange, recentFiles]);

  const handleExportComplete = useCallback(() => {
    setHasUnsavedChanges(false);
    setLastSaveTime(new Date());
  }, []);

  const loadAutoSave = useCallback(() => {
    try {
      const stored = localStorage.getItem('alkemy-autosave');
      if (stored) {
        const { data: autoSaveData, timestamp } = JSON.parse(stored);
        if (confirm(`Load auto-saved data from ${new Date(timestamp).toLocaleString()}?`)) {
          onDataChange(autoSaveData);
          setHasUnsavedChanges(false);
        }
      }
    } catch (error) {
      console.error('Failed to load auto-save:', error);
    }
  }, [onDataChange]);

  const clearAutoSave = useCallback(() => {
    localStorage.removeItem('alkemy-autosave');
    setLastSaveTime(null);
  }, []);

  // Check for auto-save on mount
  useEffect(() => {
    const stored = localStorage.getItem('alkemy-autosave');
    if (stored) {
      try {
        const { timestamp } = JSON.parse(stored);
        const savedDate = new Date(timestamp);
        const hoursSinceS…Save = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceSave < 24) {
          // Show notification about available auto-save
          console.info(`Auto-save available from ${savedDate.toLocaleString()}`);
        }
      } catch {
        // Invalid auto-save data
      }
    }
  }, []);

  return (
    <>
      <div className={cn('flex items-center gap-2', className)}>
        {/* Import Button */}
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Import JSON"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>

        {/* Export Button */}
        <button
          onClick={() => setIsExportOpen(true)}
          disabled={!data || !data.requests || data.requests.length === 0}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            data && data.requests && data.requests.length > 0
              ? 'hover:bg-black/5 dark:hover:bg-white/5'
              : 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Export JSON"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* Auto-save Toggle */}
        {showAutoSave && (
          <div className="flex items-center gap-2 px-3 py-2 border-l">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Auto-save</span>
            </label>
            
            {autoSaveEnabled && lastSaveTime && (
              <span className="text-xs text-muted-foreground">
                Saved {lastSaveTime.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="w-3 h-3" />
            Unsaved changes
          </div>
        )}
      </div>

      {/* Recovery Options */}
      {!data || (data.requests && data.requests.length === 0) ? (
        <RecoveryOptions 
          onLoadAutoSave={loadAutoSave}
          onClearAutoSave={clearAutoSave}
          recentFiles={recentFiles}
        />
      ) : null}

      {/* Dialogs */}
      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => {
          setIsExportOpen(false);
          handleExportComplete();
        }}
        data={data}
      />
    </>
  );
}

interface RecoveryOptionsProps {
  onLoadAutoSave: () => void;
  onClearAutoSave: () => void;
  recentFiles: string[];
}

function RecoveryOptions({ 
  onLoadAutoSave, 
  onClearAutoSave,
  recentFiles 
}: RecoveryOptionsProps) {
  const [hasAutoSave, setHasAutoSave] = useState(false);

  useEffect(() => {
    setHasAutoSave(!!localStorage.getItem('alkemy-autosave'));
  }, []);

  if (!hasAutoSave && recentFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-start gap-2">
        <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium mb-2">Recovery Options</p>
          
          {hasAutoSave && (
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onLoadAutoSave}
                className="text-sm text-primary hover:underline"
              >
                Load auto-saved data
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={onClearAutoSave}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear auto-save
              </button>
            </div>
          )}
          
          {recentFiles.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Recent files:</p>
              <div className="flex flex-wrap gap-1">
                {recentFiles.map((file, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-background rounded"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileOperationsManager;