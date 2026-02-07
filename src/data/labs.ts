import { Lab } from '../types';

export const labs: Lab[] = [
  {
    id: 'todo-app',
    title: 'Todo App',
    description: 'Build a complete todo application with add, delete, and toggle functionality.',
    requiredLevel: 1,
    xpReward: 200,
    technologies: ['React', 'JavaScript'],
    steps: [
      {
        id: 'step-1',
        title: 'Setup State',
        instructions: 'Create a TodoApp component with a todos state (empty array) and an input state (empty string).',
        starterCode: `import { useState } from 'react';

export default function TodoApp() {
  // Create todos and input state

  return (
    <div>
      <h1>My Todos</h1>
    </div>
  );
}`,
        validationPrompt: 'Check if useState is used for todos array and input string.',
        aiHint: 'Use useState([]) for todos and useState("") for input.'
      },
      {
        id: 'step-2',
        title: 'Add Input',
        instructions: 'Add an input field that updates the input state, and a button "Add".',
        starterCode: `import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  return (
    <div>
      <h1>My Todos</h1>
      {/* Add input and button */}
    </div>
  );
}`,
        validationPrompt: 'Check for controlled input with value and onChange.',
        aiHint: 'Use value={input} and onChange={(e) => setInput(e.target.value)}.'
      },
      {
        id: 'step-3',
        title: 'Add Todo Function',
        instructions: 'Create an addTodo function that adds the input text to todos array and clears the input.',
        starterCode: `import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    // Add todo and clear input
  };

  return (
    <div>
      <h1>My Todos</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
    </div>
  );
}`,
        validationPrompt: 'Check if addTodo uses spread operator and clears input.',
        aiHint: 'Use setTodos([...todos, { id: Date.now(), text: input }]) then setInput("").'
      },
      {
        id: 'step-4',
        title: 'Display Todos',
        instructions: 'Map through todos and display each one in a list. Add a delete button for each.',
        starterCode: `import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  };

  const deleteTodo = (id) => {
    // Remove todo by id
  };

  return (
    <div>
      <h1>My Todos</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      {/* Map todos here */}
    </div>
  );
}`,
        validationPrompt: 'Check if todos.map is used with key and delete functionality.',
        aiHint: 'Use filter to remove: setTodos(todos.filter(t => t.id !== id)).'
      }
    ]
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Build a weather dashboard with conditional rendering and dynamic styling.',
    requiredLevel: 2,
    xpReward: 300,
    technologies: ['React', 'CSS'],
    steps: [
      {
        id: 'step-1',
        title: 'Basic Structure',
        instructions: 'Create a Weather component with a title "Weather Dashboard" in an h1.',
        starterCode: `export default function Weather() {
  return (
    <div>
      {/* Add title */}
    </div>
  );
}`,
        validationPrompt: 'Check for h1 with Weather Dashboard text.',
        aiHint: 'Simply add <h1>Weather Dashboard</h1> inside the div.'
      },
      {
        id: 'step-2',
        title: 'Temperature Display',
        instructions: 'Add a temperature state (25) and display it as "25°C".',
        starterCode: `import { useState } from 'react';

export default function Weather() {
  // Add temperature state

  return (
    <div>
      <h1>Weather Dashboard</h1>
      {/* Show temperature */}
    </div>
  );
}`,
        validationPrompt: 'Check for useState with temperature and °C display.',
        aiHint: 'Use useState(25) and display {temperature}°C.'
      },
      {
        id: 'step-3',
        title: 'Conditional Styling',
        instructions: 'Change background color based on temperature: blue if < 20, orange if >= 20.',
        starterCode: `import { useState } from 'react';

export default function Weather() {
  const [temperature, setTemperature] = useState(25);

  return (
    <div style={{ /* conditional style */ }}>
      <h1>Weather Dashboard</h1>
      <p>{temperature}°C</p>
    </div>
  );
}`,
        validationPrompt: 'Check for conditional backgroundColor based on temperature.',
        aiHint: 'Use backgroundColor: temperature < 20 ? "lightblue" : "orange".'
      }
    ]
  },
  {
    id: 'counter-advanced',
    title: 'Advanced Counter',
    description: 'Build a counter with increment, decrement, reset, and custom step.',
    requiredLevel: 2,
    xpReward: 250,
    technologies: ['React'],
    steps: [
      {
        id: 'step-1',
        title: 'Basic Counter',
        instructions: 'Create a counter with count state and increment/decrement buttons.',
        starterCode: `import { useState } from 'react';

export default function Counter() {
  // Add count state and buttons

  return (
    <div>
      <h1>Counter</h1>
    </div>
  );
}`,
        validationPrompt: 'Check for useState, increment and decrement buttons.',
        aiHint: 'Use useState(0) and two buttons with onClick handlers.'
      },
      {
        id: 'step-2',
        title: 'Add Reset',
        instructions: 'Add a Reset button that sets count back to 0.',
        starterCode: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      {/* Add reset button */}
    </div>
  );
}`,
        validationPrompt: 'Check for reset button that sets count to 0.',
        aiHint: 'Add <button onClick={() => setCount(0)}>Reset</button>.'
      },
      {
        id: 'step-3',
        title: 'Custom Step',
        instructions: 'Add a step state (default 1) with an input to change it. Increment/decrement by step value.',
        starterCode: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  // Add step state

  return (
    <div>
      <h1>Counter: {count}</h1>
      {/* Add step input */}
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
        validationPrompt: 'Check for step state and increment/decrement using step value.',
        aiHint: 'Use setCount(count + step) and setCount(count - step).'
      }
    ]
  },
  {
    id: 'user-profile-card',
    title: 'User Profile Card',
    description: 'Create a reusable profile card component with props and styling.',
    requiredLevel: 3,
    xpReward: 350,
    technologies: ['React', 'CSS'],
    steps: [
      {
        id: 'step-1',
        title: 'Basic Card',
        instructions: 'Create a ProfileCard component that accepts name and role props.',
        starterCode: `export default function ProfileCard({ name, role }) {
  return (
    <div>
      {/* Display name and role */}
    </div>
  );
}`,
        validationPrompt: 'Check if name and role props are displayed.',
        aiHint: 'Use {name} in an h2 and {role} in a p tag.'
      },
      {
        id: 'step-2',
        title: 'Add Avatar',
        instructions: 'Add an avatar prop (URL) and display it as an image. Use a default if not provided.',
        starterCode: `export default function ProfileCard({
  name,
  role,
  avatar = "/default-avatar.png"
}) {
  return (
    <div>
      {/* Add image */}
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}`,
        validationPrompt: 'Check for img tag with avatar src and default value.',
        aiHint: 'Add <img src={avatar} alt={name} /> before the name.'
      },
      {
        id: 'step-3',
        title: 'Add Styling',
        instructions: 'Style the card with a border, padding, and rounded avatar (use inline styles).',
        starterCode: `export default function ProfileCard({
  name,
  role,
  avatar = "/default-avatar.png"
}) {
  return (
    <div style={{ /* card styles */ }}>
      <img src={avatar} alt={name} style={{ /* avatar styles */ }} />
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}`,
        validationPrompt: 'Check for border and borderRadius styles.',
        aiHint: 'Use border: "2px solid black", padding: 20, borderRadius: "50%" for avatar.'
      }
    ]
  },
  {
    id: 'toggle-theme',
    title: 'Theme Toggler',
    description: 'Build a dark/light theme toggle with Context API.',
    requiredLevel: 4,
    xpReward: 400,
    technologies: ['React', 'CSS'],
    steps: [
      {
        id: 'step-1',
        title: 'Theme State',
        instructions: 'Create a component with theme state ("light") and a toggle button.',
        starterCode: `import { useState } from 'react';

export default function ThemeApp() {
  // Add theme state

  return (
    <div>
      <p>Current theme: </p>
      {/* Add toggle button */}
    </div>
  );
}`,
        validationPrompt: 'Check for theme state and toggle functionality.',
        aiHint: 'Use useState("light") and toggle with theme === "light" ? "dark" : "light".'
      },
      {
        id: 'step-2',
        title: 'Apply Theme',
        instructions: 'Apply different background and text colors based on theme.',
        starterCode: `import { useState } from 'react';

export default function ThemeApp() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ /* theme-based styles */ }}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}`,
        validationPrompt: 'Check for conditional backgroundColor and color styles.',
        aiHint: 'Use backgroundColor: theme === "dark" ? "#333" : "#fff".'
      }
    ]
  },
  {
    id: 'form-validation',
    title: 'Form with Validation',
    description: 'Build a signup form with real-time validation.',
    requiredLevel: 4,
    xpReward: 450,
    technologies: ['React', 'JavaScript'],
    steps: [
      {
        id: 'step-1',
        title: 'Form Fields',
        instructions: 'Create a form with email and password inputs (controlled).',
        starterCode: `import { useState } from 'react';

export default function SignupForm() {
  // Add email and password states

  return (
    <form>
      <h2>Sign Up</h2>
      {/* Add inputs */}
    </form>
  );
}`,
        validationPrompt: 'Check for controlled email and password inputs.',
        aiHint: 'Use useState for each field with value and onChange.'
      },
      {
        id: 'step-2',
        title: 'Email Validation',
        instructions: 'Add validation: show error if email does not contain "@".',
        starterCode: `import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add error state

  return (
    <form>
      <h2>Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {/* Show error if invalid */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
    </form>
  );
}`,
        validationPrompt: 'Check for email validation with @ check and error display.',
        aiHint: 'Check !email.includes("@") and display error message conditionally.'
      },
      {
        id: 'step-3',
        title: 'Submit Handler',
        instructions: 'Add onSubmit that prevents default and only logs "Success" if both fields are valid.',
        starterCode: `import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    // Validate and submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}`,
        validationPrompt: 'Check for e.preventDefault and validation in handleSubmit.',
        aiHint: 'Use e.preventDefault(), validate fields, then console.log("Success").'
      }
    ]
  },
  {
    id: 'custom-hook-mastery',
    title: 'Custom Hook: useWindowSize',
    description: 'Create a custom hook to track browser window dimensions.',
    requiredLevel: 5,
    xpReward: 500,
    technologies: ['React', 'JavaScript'],
    steps: [
      {
        id: 'step-1',
        title: 'Basic Hook',
        instructions: 'Create useWindowSize hook that returns { width, height } with initial values.',
        starterCode: `import { useState } from 'react';

export function useWindowSize() {
  // Return width and height
}`,
        validationPrompt: 'Check if useWindowSize returns object with width and height.',
        aiHint: 'Return { width: window.innerWidth, height: window.innerHeight }.'
      },
      {
        id: 'step-2',
        title: 'Add State',
        instructions: 'Use useState to store the size and initialize with current window dimensions.',
        starterCode: `import { useState } from 'react';

export function useWindowSize() {
  // Add state for size

  return size;
}`,
        validationPrompt: 'Check for useState with window dimensions.',
        aiHint: 'Use useState({ width: window.innerWidth, height: window.innerHeight }).'
      },
      {
        id: 'step-3',
        title: 'Add Resize Listener',
        instructions: 'Use useEffect to add resize event listener and clean it up on unmount.',
        starterCode: `import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Add resize listener with cleanup
  }, []);

  return size;
}`,
        validationPrompt: 'Check for resize event listener with cleanup function.',
        aiHint: 'Add listener with addEventListener and return cleanup with removeEventListener.'
      }
    ]
  }
];

export function getLab(id: string): Lab | undefined {
  return labs.find(l => l.id === id);
}
