import { Lab } from '../types';

export const labs: Lab[] = [
    {
        id: 'weather-dashboard',
        title: 'Weather Dashboard',
        description: 'Build a primitive weather dashboard using conditional rendering and state.',
        requiredLevel: 2,
        xpReward: 300,
        steps: [
            {
                id: 'step-1',
                title: 'Initial Container',
                instructions: 'Create a simple div with a title "Weather Quest".',
                starterCode: 'export default function Weather() {\n  return (\n    <div>\n      {/* Your title here */}\n    </div>\n  );\n}',
                validationPrompt: 'Check if the code has a h1 or h2 with text "Weather Quest".',
                aiHint: 'Try adding an <h1> tag inside the div.'
            },
            {
                id: 'step-2',
                title: 'Weather Card',
                instructions: 'Add a section showing the current temperature "25°C".',
                starterCode: 'export default function Weather() {\n  return (\n    <div className="p-4 border-4 border-black bg-blue-100">\n      <h1 className="text-2xl font-black mb-4 uppercase text-black">Weather Quest</h1>\n      {/* Add temperature here */}\n    </div>\n  );\n}',
                validationPrompt: 'Check if there is a p or div containing the string "25°C".',
                aiHint: 'You can use a <p> tag with some styling to show the temperature.'
            }
        ]
    },
    {
        id: 'custom-hook-mastery',
        title: 'Custom Hook Mastery',
        description: 'Create a custom hook useWindowSize to track browser dimensions.',
        requiredLevel: 5,
        xpReward: 500,
        steps: [
            {
                id: 'step-1',
                title: 'Basic Hook Structure',
                instructions: 'Start by defining a function useWindowSize that returns an object { width: 0, height: 0 }.',
                starterCode: 'import { useState, useEffect } from "react";\n\nexport function useWindowSize() {\n  // Return size here\n}',
                validationPrompt: 'Check if useWindowSize returns width and height properties.',
                aiHint: 'Hooks are just functions! Start by returning a simple object.'
            }
        ]
    }
];

export function getLab(id: string): Lab | undefined {
    return labs.find(l => l.id === id);
}
