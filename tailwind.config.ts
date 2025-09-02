import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', 'class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  			'mono': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
  			'display': ['Outfit', 'Inter', 'sans-serif'],
  		},
  		fontSize: {
  			'h1': ['2.5rem', { lineHeight: '1.1', fontWeight: '800' }],
  			'h2': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
  			'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
  			'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  			'small': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
  			'code': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],
  		},
  		colors: {
  			// Core Design System Colors - Exact Specification
  			'bg-primary': '#0a0a0f',      // Deep space black
  			'bg-secondary': '#1a1a2e',    // Darker navy
  			'bg-tertiary': '#16213e',     // Midnight blue
  			'primary-neon': '#a855f7',    // Purple primary
  			'secondary-neon': '#8b5cf6',  // Violet secondary
  			'accent-electric': '#06ffa5', // Electric green
  			'accent-pink': '#ec4899',     // Hot pink
  			'accent-cyan': '#22d3ee',     // Cyan
  			'text-primary': '#f8fafc',    // Almost white
  			'text-secondary': '#cbd5e1',  // Light slate
  			'text-muted': '#64748b',      // Slate
  			'border-glow': '#6366f1',     // Indigo
  			success: '#10b981',           // Emerald
  			warning: '#f59e0b',           // Amber
  			error: '#ef4444',              // Red
  			
  			// Legacy colors for backward compatibility
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backdropBlur: {
  			glass: '10px',
  			xs: '4px',
  			sm: '8px',
  			md: '12px',
  			lg: '16px',
  			xl: '20px'
  		},
  		boxShadow: {
  			// Glow effects with intensity levels
  			'glow-xs': '0 0 10px rgba(168, 85, 247, 0.2)',
  			'glow-sm': '0 0 15px rgba(168, 85, 247, 0.25)',
  			'glow': '0 0 20px rgba(168, 85, 247, 0.3)',
  			'glow-md': '0 0 25px rgba(168, 85, 247, 0.35)',
  			'glow-lg': '0 0 30px rgba(168, 85, 247, 0.4)',
  			'glow-xl': '0 0 40px rgba(168, 85, 247, 0.5)',
  			
  			// Color-specific glow effects
  			'glow-electric': '0 0 20px rgba(6, 255, 165, 0.4)',
  			'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
  			'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
  			'glow-success': '0 0 20px rgba(16, 185, 129, 0.4)',
  			'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4)',
  			'glow-error': '0 0 20px rgba(239, 68, 68, 0.4)',
  			
  			// Border glow effects
  			'glow-border': '0 0 0 1px rgba(99, 102, 241, 0.3)',
  			'glow-border-strong': '0 0 0 2px rgba(99, 102, 241, 0.5)'
  		},
  		backgroundImage: {
  			// Neon gradient utilities
  			'primary-gradient': 'linear-gradient(135deg, #a855f7, #8b5cf6)',
  			'secondary-gradient': 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  			'accent-gradient': 'linear-gradient(135deg, #06ffa5, #22d3ee)',
  			'danger-gradient': 'linear-gradient(135deg, #ec4899, #ef4444)',
  			'dark-gradient': 'linear-gradient(180deg, #0a0a0f, #1a1a2e)',
  			'glass-gradient': 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.6))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			glass: '12px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'glow-pulse': {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
  					opacity: '1'
  				},
  				'50%': {
  					boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
  					opacity: '0.9'
  				}
  			},
  			'validation-flash': {
  				'0%': { backgroundColor: 'transparent' },
  				'50%': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  				'100%': { backgroundColor: 'transparent' }
  			},
  			'border-draw': {
  				'0%': { 
  					strokeDasharray: '0 100%',
  					opacity: '0'
  				},
  				'100%': { 
  					strokeDasharray: '100% 0',
  					opacity: '1'
  				}
  			},
  			'element-materialize': {
  				'0%': {
  					transform: 'scale(0) translateZ(0)',
  					opacity: '0',
  					filter: 'blur(10px)'
  				},
  				'50%': {
  					transform: 'scale(1.1) translateZ(0)',
  					opacity: '0.8'
  				},
  				'100%': {
  					transform: 'scale(1) translateZ(0)',
  					opacity: '1',
  					filter: 'blur(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  			'glow-pulse-slow': 'glow-pulse 3s ease-in-out infinite',
  			'validation-flash': 'validation-flash 150ms ease-out',
  			'border-draw': 'border-draw 400ms ease-in-out',
  			'element-materialize': 'element-materialize 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  		},
  		transitionTimingFunction: {
  			'panel-slide': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			'element-bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

export default config