'use client';

import React from 'react';

const ColorPaletteDemo: React.FC = () => {
  const colorGroups = [
    {
      title: 'Background Colors',
      colors: [
        { name: 'bg-primary', class: 'bg-bg-primary', hex: '#0a0a0f' },
        { name: 'bg-secondary', class: 'bg-bg-secondary', hex: '#1a1a2e' },
        { name: 'bg-tertiary', class: 'bg-bg-tertiary', hex: '#16213e' },
      ],
    },
    {
      title: 'Neon Colors',
      colors: [
        { name: 'primary-neon', class: 'bg-primary-neon', hex: '#a855f7' },
        { name: 'secondary-neon', class: 'bg-secondary-neon', hex: '#8b5cf6' },
      ],
    },
    {
      title: 'Accent Colors',
      colors: [
        { name: 'accent-electric', class: 'bg-accent-electric', hex: '#06ffa5' },
        { name: 'accent-pink', class: 'bg-accent-pink', hex: '#ec4899' },
        { name: 'accent-cyan', class: 'bg-accent-cyan', hex: '#22d3ee' },
      ],
    },
    {
      title: 'Text Colors',
      colors: [
        { name: 'text-primary', class: 'bg-text-primary', hex: '#f8fafc' },
        { name: 'text-secondary', class: 'bg-text-secondary', hex: '#cbd5e1' },
        { name: 'text-muted', class: 'bg-text-muted', hex: '#64748b' },
      ],
    },
    {
      title: 'Semantic Colors',
      colors: [
        { name: 'success', class: 'bg-success', hex: '#10b981' },
        { name: 'warning', class: 'bg-warning', hex: '#f59e0b' },
        { name: 'error', class: 'bg-error', hex: '#ef4444' },
      ],
    },
  ];

  const glassEffects = [
    {
      title: 'Glass Panel',
      class: 'glass-panel',
      description: 'Standard glass morphism panel',
    },
    {
      title: 'Glass Panel Tertiary',
      class: 'glass-panel-tertiary',
      description: 'Glass panel with tertiary background',
    },
  ];

  const gradients = [
    {
      title: 'Primary Gradient',
      class: 'bg-primary-gradient',
      description: 'Purple to violet gradient',
    },
    {
      title: 'Accent Gradient',
      class: 'bg-accent-gradient',
      description: 'Electric green to cyan',
    },
  ];

  const glowEffects = [
    {
      title: 'Primary Glow',
      class: 'shadow-glow',
      baseClass: 'bg-bg-secondary',
    },
    {
      title: 'Electric Glow',
      class: 'shadow-glow-electric',
      baseClass: 'bg-bg-secondary',
    },
    {
      title: 'Error Glow',
      class: 'shadow-glow-error',
      baseClass: 'bg-bg-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gradient-primary">
            Core Design System
          </h1>
          <p className="text-text-secondary text-lg">
            Neon Dark Mode Color Palette & Glass Morphism
          </p>
        </div>

        {/* Color Palette */}
        <div className="space-y-8">
          {colorGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-2xl font-semibold text-text-primary">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {group.colors.map((color) => (
                  <div
                    key={color.name}
                    className="glass-panel p-4 space-y-2 hover:shadow-glow transition-all duration-200"
                  >
                    <div
                      className={`${color.class} h-20 rounded-lg border border-primary-neon/20`}
                    />
                    <div className="space-y-1">
                      <p className="text-text-primary font-medium">{color.name}</p>
                      <p className="text-text-muted text-sm font-mono">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Glass Morphism Effects */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Glass Morphism Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {glassEffects.map((effect) => (
              <div
                key={effect.title}
                className={`${effect.class} p-6 space-y-2`}
              >
                <h3 className="text-xl font-semibold text-text-primary">
                  {effect.title}
                </h3>
                <p className="text-text-secondary">{effect.description}</p>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-primary-gradient text-text-primary rounded-lg hover:shadow-glow-lg transition-all duration-200 transform hover:scale-105">
                    Sample Button
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradients */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Gradient System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gradients.map((gradient) => (
              <div
                key={gradient.title}
                className={`${gradient.class} p-6 rounded-glass space-y-2`}
              >
                <h3 className="text-xl font-semibold text-white">
                  {gradient.title}
                </h3>
                <p className="text-white/90">{gradient.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Glow Effects */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Glow Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {glowEffects.map((glow) => (
              <div
                key={glow.title}
                className={`${glow.baseClass} ${glow.class} p-6 rounded-glass border border-primary-neon/20`}
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  {glow.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Interactive Elements
          </h2>
          <div className="glass-panel p-6 space-y-6">
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-primary-gradient text-text-primary font-medium rounded-lg hover:shadow-glow-lg transition-all duration-200 transform hover:scale-105">
                Primary Action
              </button>
              <button className="px-6 py-3 bg-bg-tertiary border border-primary-neon/30 text-text-primary font-medium rounded-lg hover:border-primary-neon/50 hover:shadow-glow transition-all duration-200">
                Secondary Action
              </button>
              <button className="px-6 py-3 bg-accent-electric text-bg-primary font-medium rounded-lg hover:shadow-glow-electric transition-all duration-200 transform hover:scale-105">
                Success Action
              </button>
              <button className="px-6 py-3 bg-error text-text-primary font-medium rounded-lg hover:shadow-glow-error transition-all duration-200">
                Danger Action
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Input with glow focus"
                className="w-full px-4 py-2 bg-bg-tertiary border border-primary-neon/20 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-neon/50 focus:shadow-glow transition-all duration-200"
              />
              
              <div className="p-4 bg-bg-tertiary/50 border border-success/30 rounded-lg">
                <p className="text-success font-medium">Success Message</p>
                <p className="text-text-secondary text-sm mt-1">
                  Operation completed successfully with glow effect.
                </p>
              </div>

              <div className="p-4 bg-bg-tertiary/50 border border-warning/30 rounded-lg">
                <p className="text-warning font-medium">Warning Message</p>
                <p className="text-text-secondary text-sm mt-1">
                  Please review the following items.
                </p>
              </div>

              <div className="p-4 bg-bg-tertiary/50 border border-error/30 rounded-lg">
                <p className="text-error font-medium">Error Message</p>
                <p className="text-text-secondary text-sm mt-1">
                  An error occurred during the operation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Text Styles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            Typography & Text Effects
          </h2>
          <div className="glass-panel p-6 space-y-4">
            <h1 className="text-4xl font-bold text-gradient-primary">
              Gradient Heading
            </h1>
            <h2 className="text-3xl font-semibold text-text-primary text-glow-primary">
              Glowing Text Effect
            </h2>
            <h3 className="text-2xl font-medium text-gradient-accent">
              Accent Gradient Text
            </h3>
            <p className="text-text-primary">
              Primary text color for main content.
            </p>
            <p className="text-text-secondary">
              Secondary text color for supporting content.
            </p>
            <p className="text-text-muted">
              Muted text color for de-emphasized content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteDemo;