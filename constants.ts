
import React from 'react';
import { GameState, StatDefinition, CrisisEvent, Stat } from './types';

export const WIN_YEAR = 2034; // 10 years, 20 turns
export const MAX_YEAR = 2034;

export const INITIAL_GAME_STATE: GameState = {
  stats: {
    economy: 50,
    social: 50,
    politics: 50,
    environment: 50,
    international: 50,
  },
  year: 2024,
  log: [],
  status: 'playing',
  currentEvent: null,
};

const StatIcon = ({ path }: { path: string }): React.ReactElement => (
    React.createElement(
        'svg',
        {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-6 w-6 mr-3",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        },
        React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: path
        })
    )
);

export const STAT_DEFINITIONS: Record<Stat, StatDefinition> = {
  economy: {
    label: 'Economy',
    icon: React.createElement(StatIcon, { path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" }),
    description: 'Economic growth, inflation, unemployment, and foreign investment.'
  },
  social: {
    label: 'Social Welfare',
    icon: React.createElement(StatIcon, { path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }),
    description: 'Education, healthcare, poverty levels, and public happiness.'
  },
  politics: {
    label: 'Politics & Stability',
    icon: React.createElement(StatIcon, { path: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
    description: 'Public support, parliamentary relations, corruption, and stability.'
  },
  environment: {
    label: 'Environment',
    icon: React.createElement(StatIcon, { path: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945C21.055 11 21 11.5 21 12c0 3.866-3.582 7-8 7s-8-3.134-8-7c0-.5.055-1 .146-1.485zM12 11V3m0 0L9 6m3-3l3 6" }),
    description: 'Deforestation, pollution levels, and renewable energy adoption.'
  },
  international: {
    label: 'Intl. Relations',
    icon: React.createElement(StatIcon, { path: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945C21.055 11 21 11.5 21 12c0 3.866-3.582 7-8 7s-8-3.134-8-7c0-.5.055-1 .146-1.485z" }),
    description: 'Diplomacy, trade agreements, alliances, and global standing.'
  },
};

export const CRISIS_EVENTS: CrisisEvent[] = [
    {
        title: 'Natural Disaster!',
        description: 'A major earthquake has struck West Java, causing widespread damage and displacing thousands. Immediate action is required to manage the humanitarian crisis and begin reconstruction efforts.',
        image: 'https://picsum.photos/seed/earthquake/400/200'
    },
    {
        title: 'Global Pandemic',
        description: 'A new, highly contagious virus is spreading rapidly across the globe. Indonesia has its first confirmed cases. You must decide on a public health strategy to prevent a nationwide catastrophe.',
        image: 'https://picsum.photos/seed/pandemic/400/200'
    },
    {
        title: 'Corruption Scandal',
        description: 'A major news outlet has exposed a massive corruption ring involving several of your cabinet ministers. Public outrage is growing, and your administration\'s credibility is on the line.',
        image: 'https://picsum.photos/seed/scandal/400/200'
    },
    {
        title: 'Separatist Movement Gains Traction',
        description: 'A separatist movement in Papua is gaining significant support, leading to civil unrest and calls for independence. Your approach will determine if the situation escalates into a full-blown conflict.',
        image: 'https://picsum.photos/seed/separatist/400/200'
    }
];