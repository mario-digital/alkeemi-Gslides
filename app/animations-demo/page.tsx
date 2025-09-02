'use client';

import React, { useState } from 'react';
import { GlowButton } from '@/app/components/animations/GlowButton';
import { AnimatedPanel } from '@/app/components/animations/AnimatedPanel';
import { ValidationFeedback } from '@/app/components/animations/ValidationFeedback';
import { NeonBorderInput } from '@/app/components/animations/NeonBorderInput';
import { ResizablePanel } from '@/app/components/animations/ResizablePanel';
import { JsonSyntaxHighlight } from '@/app/components/animations/JsonSyntaxHighlight';
import { StaggeredMaterialize, PreviewElement } from '@/app/components/animations/ElementMaterialize';
import { PerformanceMonitor } from '@/app/components/animations/PerformanceMonitor';

export default function AnimationsDemo() {
  const [showPanel, setShowPanel] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
  const [inputValue, setInputValue] = useState('');
  const [showElements, setShowElements] = useState(false);
  const [showPerformance, setShowPerformance] = useState(true);

  const sampleJson = {
    requests: [{
      createSlide: {
        objectId: "slide_001",
        insertionIndex: 1,
        slideLayoutReference: {
          predefinedLayout: "TITLE_AND_BODY"
        }
      }
    }]
  };

  const elements = [
    { type: 'text' as const, content: 'Text Element' },
    { type: 'shape' as const, content: 'Shape Element' },
    { type: 'image' as const, content: 'Image Element' },
    { type: 'table' as const, content: 'Table Element' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <PerformanceMonitor show={showPerformance} />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-gradient-primary mb-4">
            Animation Framework Demo
          </h1>
          <p className="text-body text-text-secondary">
            All 8 animations with 60fps performance
          </p>
        </div>

        {/* 1. Glow Pulse Animation */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">1. Glow Pulse Animation</h2>
          <div className="flex gap-4">
            <GlowButton variant="primary">Primary Button</GlowButton>
            <GlowButton variant="secondary" glowIntensity="subtle">Secondary</GlowButton>
            <GlowButton variant="success" glowIntensity="strong">Success</GlowButton>
            <GlowButton variant="danger" pulseAnimation={false}>No Pulse</GlowButton>
          </div>
        </section>

        {/* 2. Panel Slide Animation */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">2. Panel Slide Animation</h2>
          <GlowButton onClick={() => setShowPanel(!showPanel)}>
            Toggle Panel
          </GlowButton>
          <div className="relative h-64 overflow-hidden rounded-glass">
            <AnimatedPanel
              isOpen={showPanel}
              direction="left"
              className="absolute inset-0 p-6"
            >
              <h3 className="mb-4">Sliding Panel Content</h3>
              <p className="text-body text-text-secondary">
                This panel slides in with a 300ms cubic-bezier animation
              </p>
            </AnimatedPanel>
          </div>
        </section>

        {/* 3. Validation Flash */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">3. Validation Flash</h2>
          <div className="flex gap-4">
            <GlowButton 
              variant="success"
              onClick={() => setValidationStatus('success')}
            >
              Trigger Success
            </GlowButton>
            <GlowButton 
              variant="danger"
              onClick={() => setValidationStatus('error')}
            >
              Trigger Error
            </GlowButton>
            <GlowButton 
              variant="secondary"
              onClick={() => setValidationStatus('warning')}
            >
              Trigger Warning
            </GlowButton>
          </div>
          <ValidationFeedback 
            status={validationStatus}
            message={`This is a ${validationStatus} message with flash animation`}
          >
            <p className="text-body">Validation feedback area</p>
          </ValidationFeedback>
        </section>

        {/* 4. Hover Elevation */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">4. Hover Elevation</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="card-hover-elevate glass-panel-tertiary p-4 rounded-glass">
              <h3 className="mb-2">Card 1</h3>
              <p className="text-small text-text-secondary">Hover to elevate</p>
            </div>
            <div className="card-hover-elevate glass-panel-tertiary p-4 rounded-glass">
              <h3 className="mb-2">Card 2</h3>
              <p className="text-small text-text-secondary">With glow shadow</p>
            </div>
            <div className="card-hover-elevate glass-panel-tertiary p-4 rounded-glass">
              <h3 className="mb-2">Card 3</h3>
              <p className="text-small text-text-secondary">200ms ease-out</p>
            </div>
          </div>
        </section>

        {/* 5. Neon Border Draw */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">5. Neon Border Draw</h2>
          <div className="space-y-4">
            <NeonBorderInput
              placeholder="Focus to see neon border animation..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <NeonBorderInput
              placeholder="Error state input..."
              error
            />
            <NeonBorderInput
              placeholder="Success state input..."
              success
            />
          </div>
        </section>

        {/* 6. JSON Syntax Highlighting */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">6. JSON Syntax Highlighting</h2>
          <JsonSyntaxHighlight
            json={sampleJson}
            isValid={true}
          />
        </section>

        {/* 7. Split Panel Resize */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">7. Split Panel Resize</h2>
          <div className="h-64 rounded-glass overflow-hidden border border-primary-neon/20">
            <ResizablePanel
              leftPanel={
                <div className="p-4 h-full bg-bg-tertiary/50">
                  <h3 className="mb-2">Left Panel</h3>
                  <p className="text-small text-text-secondary">
                    Drag the divider to resize panels with glow effect
                  </p>
                </div>
              }
              rightPanel={
                <div className="p-4 h-full bg-bg-tertiary/50">
                  <h3 className="mb-2">Right Panel</h3>
                  <p className="text-small text-text-secondary">
                    Enhanced glow during drag operation
                  </p>
                </div>
              }
              defaultSize={50}
            />
          </div>
        </section>

        {/* 8. Element Materialize */}
        <section className="glass-panel p-6 space-y-4">
          <h2 className="text-primary-neon">8. Element Materialize</h2>
          <GlowButton onClick={() => setShowElements(!showElements)}>
            {showElements ? 'Reset' : 'Materialize Elements'}
          </GlowButton>
          {showElements && (
            <StaggeredMaterialize
              staggerDelay={100}
              containerClassName="grid grid-cols-2 gap-4 mt-4"
            >
              {elements.map((el, idx) => (
                <PreviewElement key={idx} elementType={el.type}>
                  <p className="text-body">{el.content}</p>
                </PreviewElement>
              ))}
            </StaggeredMaterialize>
          )}
        </section>

        {/* Performance Controls */}
        <section className="glass-panel p-6">
          <h2 className="text-h2 text-primary-neon mb-4">Performance Monitor</h2>
          <GlowButton onClick={() => setShowPerformance(!showPerformance)}>
            {showPerformance ? 'Hide' : 'Show'} Performance Monitor
          </GlowButton>
        </section>
      </div>
    </div>
  );
}