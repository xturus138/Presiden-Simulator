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
            className: "h-8 w-8 mr-3",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
        },
        React.createElement('path', {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: path
        })
    )
);

export const STAT_DEFINITIONS: Record<Stat, StatDefinition> = {
  economy: {
    label: 'Economy',
    icon: React.createElement(StatIcon, { path: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" }),
    description: 'Economic growth, inflation, unemployment, and foreign investment.'
  },
  social: {
    label: 'Social Welfare',
    icon: React.createElement(StatIcon, { path: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21m-8.25-18h-1.5a2.25 2.25 0 00-2.25 2.25V21" }),
    description: 'Education, healthcare, poverty levels, and public happiness.'
  },
  politics: {
    label: 'Politics & Stability',
    icon: React.createElement(StatIcon, { path: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5-3v8.25" }),
    description: 'Public support, parliamentary relations, corruption, and stability.'
  },
  environment: {
    label: 'Environment',
    icon: React.createElement(StatIcon, { path: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.62a8.983 8.983 0 013.362-3.867 8.262 8.262 0 013 2.457z" }),
    description: 'Deforestation, pollution levels, and renewable energy adoption.'
  },
  international: {
    label: 'Intl. Relations',
    icon: React.createElement(StatIcon, { path: "M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.109 1.109 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.632.822l-.665-1.78-1.132-1.41a2.25 2.25 0 00-3.213.662l-.53.945a2.25 2.25 0 00.916 3.164l.852.502a2.25 2.25 0 011.019 1.837l-.33 1.473c-.076.34-.36.6-.704.665l-2.25.45a2.25 2.25 0 01-1.956-2.25l.28-1.26a1.125 1.125 0 00-.734-1.256l-1.078-.431a2.25 2.25 0 01-1.437-2.734l.249-.624a2.25 2.25 0 01.886-1.161l.51-.766c.318-.48.225-1.121-.217-1.49l-1.068-.89a1.125 1.125 0 00-.405-.864v-.568c0-.621.504-1.125 1.125-1.125H11.25c.621 0 1.125.504 1.125 1.125z" }),
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