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
  },
  {
    id: 'api-dashboard',
    title: 'API Dashboard',
    description: 'Build a dashboard that fetches, displays, and filters data from a REST API.',
    requiredLevel: 3,
    xpReward: 400,
    technologies: ['React', 'JavaScript', 'REST API'],
    steps: [
      {
        id: 'step-1',
        title: 'Fetch Users',
        instructions: 'Create a Dashboard component that fetches users from https://jsonplaceholder.typicode.com/users on mount using useEffect and displays them in a list.',
        starterCode: `import { useState, useEffect } from 'react';

export default function Dashboard() {
  // Fetch users on mount

  return (
    <div>
      <h1>User Dashboard</h1>
      {/* Display users */}
    </div>
  );
}`,
        validationPrompt: 'Check for useEffect with fetch to jsonplaceholder API and users displayed in a list.',
        aiHint: 'Use useEffect(() => { fetch("https://jsonplaceholder.typicode.com/users").then(r => r.json()).then(setUsers); }, []).'
      },
      {
        id: 'step-2',
        title: 'Add Loading State',
        instructions: 'Add loading and error states. Show "Loading..." while fetching and an error message if fetch fails.',
        starterCode: `import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  // Add loading and error states

  useEffect(() => {
    // Fetch with loading and error handling
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {/* Handle loading and error states */}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}`,
        validationPrompt: 'Check for loading state set before fetch and cleared after, with error handling in catch.',
        aiHint: 'Set setLoading(true) before fetch, setLoading(false) in finally, and setError in catch.'
      },
      {
        id: 'step-3',
        title: 'Add Search Filter',
        instructions: 'Add a search input that filters users by name in real-time. The filter should be case-insensitive.',
        starterCode: `import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add search state

  useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Filter users based on search

  return (
    <div>
      <h1>User Dashboard</h1>
      {/* Add search input */}
      {loading ? <p>Loading...</p> : (
        <ul>
          {/* Map filtered users */}
        </ul>
      )}
    </div>
  );
}`,
        validationPrompt: 'Check for search state, filtered users using .filter() with toLowerCase(), and search input.',
        aiHint: 'Use users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).'
      },
      {
        id: 'step-4',
        title: 'User Detail Card',
        instructions: 'When a user is clicked, show a detail card below the list with name, email, phone, and company name. Add a "Close" button to dismiss it.',
        starterCode: `import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  // Add selected user state

  useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>User Dashboard</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." />
      {loading ? <p>Loading...</p> : (
        <ul>
          {filtered.map(user => (
            <li key={user.id} onClick={() => { /* select user */ }}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
      {/* Show selected user detail card */}
    </div>
  );
}`,
        validationPrompt: 'Check for selectedUser state, onClick handler to set it, detail card showing name/email/phone/company, and close button.',
        aiHint: 'Use useState(null) for selectedUser, set on click, render card conditionally with a close button that sets it to null.'
      }
    ]
  },
  {
    id: 'git-conflict-resolution',
    title: 'Git: Resolve a Merge Conflict',
    description: 'Practice resolving merge conflicts in a realistic team scenario.',
    requiredLevel: 3,
    xpReward: 350,
    technologies: ['Git'],
    steps: [
      {
        id: 'step-1',
        title: 'Create Feature Branch',
        instructions: 'You are working on a project. Create a new branch called "feature/navbar" from main and switch to it.',
        starterCode: `# You are on branch "main"
# Create and switch to a new branch called "feature/navbar"

`,
        validationPrompt: 'Check if the user creates a branch called feature/navbar using git checkout -b or git switch -c.',
        aiHint: 'Use: git checkout -b feature/navbar'
      },
      {
        id: 'step-2',
        title: 'Make Changes on Feature Branch',
        instructions: 'On your feature/navbar branch, create a file called "navbar.html" and make a commit with the message "Add navbar component".',
        starterCode: `# On branch feature/navbar
# Create navbar.html and commit it

`,
        validationPrompt: 'Check if the user creates a file and commits with the correct message.',
        aiHint: 'Use: echo "<nav>Navbar</nav>" > navbar.html && git add navbar.html && git commit -m "Add navbar component"'
      },
      {
        id: 'step-3',
        title: 'Simulate Conflict',
        instructions: 'Switch back to main branch. Create the same file "navbar.html" with different content and commit it. Then try to merge feature/navbar into main.',
        starterCode: `# Switch to main, create conflicting navbar.html, commit, then merge

`,
        validationPrompt: 'Check if the user switches to main, creates a conflicting file, commits, and attempts merge.',
        aiHint: 'git checkout main, create navbar.html with different content, commit, then git merge feature/navbar.'
      },
      {
        id: 'step-4',
        title: 'Resolve the Conflict',
        instructions: 'The merge creates a conflict. Open the file, resolve the conflict markers (<<<, ===, >>>), stage the resolved file, and complete the merge commit.',
        starterCode: `# The file has conflict markers:
# <<<<<<< HEAD
# (your main changes)
# =======
# (feature branch changes)
# >>>>>>> feature/navbar
#
# Edit the file to keep both changes, then complete the merge

`,
        validationPrompt: 'Check if the user resolves conflict markers, stages the file with git add, and completes with git commit.',
        aiHint: 'Edit navbar.html to remove conflict markers, keep desired content. Then: git add navbar.html && git commit -m "Merge feature/navbar, resolve conflict"'
      }
    ]
  },
  {
    id: 'responsive-landing-page',
    title: 'Responsive Landing Page',
    description: 'Build a responsive landing page with hero section, features grid, and footer using Tailwind CSS.',
    requiredLevel: 4,
    xpReward: 450,
    technologies: ['React', 'Tailwind CSS', 'HTML'],
    steps: [
      {
        id: 'step-1',
        title: 'Hero Section',
        instructions: 'Create a LandingPage component with a hero section: a large heading, a subtitle paragraph, and a CTA button. Use Tailwind classes for styling.',
        starterCode: `export default function LandingPage() {
  return (
    <div>
      {/* Hero section */}
      <section>
        {/* Add heading, subtitle, and button */}
      </section>
    </div>
  );
}`,
        validationPrompt: 'Check for a section with an h1 heading, a p subtitle, and a button/link CTA. Should use Tailwind classes for styling.',
        aiHint: 'Use classes like text-4xl font-bold, text-gray-600, and bg-blue-500 text-white px-6 py-3 rounded for the button.'
      },
      {
        id: 'step-2',
        title: 'Features Grid',
        instructions: 'Add a features section with 3 feature cards in a responsive grid (1 column on mobile, 3 on desktop). Each card has an emoji icon, title, and description.',
        starterCode: `export default function LandingPage() {
  const features = [
    { icon: '🚀', title: 'Fast', description: 'Lightning fast performance' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
    { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
  ];

  return (
    <div>
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Build Amazing Apps</h1>
        <p className="text-gray-600 mb-8">The easiest way to create modern web applications</p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Get Started</button>
      </section>
      {/* Features grid section */}
    </div>
  );
}`,
        validationPrompt: 'Check for a responsive grid using grid-cols-1 md:grid-cols-3 or similar, with 3 feature cards mapped from the array.',
        aiHint: 'Use className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-16 max-w-6xl mx-auto" and map features.'
      },
      {
        id: 'step-3',
        title: 'Footer',
        instructions: 'Add a footer with copyright text, centered, with a top border and muted text color.',
        starterCode: `export default function LandingPage() {
  const features = [
    { icon: '🚀', title: 'Fast', description: 'Lightning fast performance' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
    { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
  ];

  return (
    <div>
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Build Amazing Apps</h1>
        <p className="text-gray-600 mb-8">The easiest way to create modern web applications</p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Get Started</button>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-16 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="border rounded-lg p-6 text-center">
            <span className="text-4xl mb-4 block">{f.icon}</span>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.description}</p>
          </div>
        ))}
      </section>
      {/* Add footer */}
    </div>
  );
}`,
        validationPrompt: 'Check for a footer element with border-top, centered text, copyright message, and muted text color.',
        aiHint: 'Use <footer className="border-t py-8 text-center text-gray-500 text-sm">.'
      }
    ]
  }
];

export function getLab(id: string): Lab | undefined {
  return labs.find(l => l.id === id);
}
