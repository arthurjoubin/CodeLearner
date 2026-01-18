import { Module, Lesson, Exercise } from '../types';

export const modules: Module[] = [
  {
    id: 'jsx-basics',
    title: 'JSX Basics',
    description: 'Learn the syntax that powers React components',
    icon: 'Code',
    requiredXp: 0,
    color: 'from-blue-400 to-blue-600',
    lessons: [],
  },
  {
    id: 'components-props',
    title: 'Components & Props',
    description: 'Build reusable UI pieces and pass data between them',
    icon: 'Boxes',
    requiredXp: 100,
    color: 'from-purple-400 to-purple-600',
    lessons: [],
  },
  {
    id: 'state-hooks',
    title: 'State with useState',
    description: 'Make your components interactive with state',
    icon: 'Database',
    requiredXp: 250,
    color: 'from-green-400 to-green-600',
    lessons: [],
  },
  {
    id: 'events',
    title: 'Event Handling',
    description: 'Respond to user interactions like clicks and inputs',
    icon: 'MousePointer',
    requiredXp: 400,
    color: 'from-orange-400 to-orange-600',
    lessons: [],
  },
  {
    id: 'effects',
    title: 'useEffect Hook',
    description: 'Handle side effects and lifecycle in components',
    icon: 'Zap',
    requiredXp: 600,
    color: 'from-yellow-400 to-yellow-600',
    lessons: [],
  },
  {
    id: 'typescript-react',
    title: 'TypeScript with React',
    description: 'Add type safety to your React applications',
    icon: 'Shield',
    requiredXp: 850,
    color: 'from-cyan-400 to-cyan-600',
    lessons: [],
  },
  {
    id: 'lists-keys',
    title: 'Lists & Keys',
    description: 'Render dynamic lists and understand the importance of keys',
    icon: 'List',
    requiredXp: 1100,
    color: 'from-indigo-400 to-indigo-600',
    lessons: [],
  },
  {
    id: 'forms-validation',
    title: 'Forms & Validation',
    description: 'Build interactive forms with proper validation',
    icon: 'FileInput',
    requiredXp: 1400,
    color: 'from-pink-400 to-pink-600',
    lessons: [],
  },
  {
    id: 'context-api',
    title: 'Context API',
    description: 'Share state across components without prop drilling',
    icon: 'Layers',
    requiredXp: 1750,
    color: 'from-teal-400 to-teal-600',
    lessons: [],
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    description: 'Create reusable logic with custom React hooks',
    icon: 'Settings',
    requiredXp: 2100,
    color: 'from-amber-400 to-amber-600',
    lessons: [],
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'Optimize your React apps with memoization and best practices',
    icon: 'Gauge',
    requiredXp: 2500,
    color: 'from-rose-400 to-rose-600',
    lessons: [],
  },
  {
    id: 'react-router',
    title: 'React Router',
    description: 'Add navigation and routing to your React applications',
    icon: 'Navigation',
    requiredXp: 3000,
    color: 'from-violet-400 to-violet-600',
    lessons: [],
  },
];

export const lessons: Lesson[] = [
  // JSX Basics
  {
    id: 'jsx-intro',
    moduleId: 'jsx-basics',
    title: 'What is JSX?',
    order: 1,
    xpReward: 15,
    difficulty: 'beginner',
    content: `# What is JSX?

JSX stands for **JavaScript XML**. It's a syntax extension that lets you write HTML-like code in JavaScript.

## Why JSX?

React uses JSX because:
- It's **visual**: You can see the UI structure in your code
- It's **powerful**: You can embed JavaScript expressions
- It's **familiar**: If you know HTML, you're halfway there

## Basic Syntax

\`\`\`jsx
// This is JSX
const element = <h1>Hello, world!</h1>;
\`\`\`

Notice how it looks like HTML but lives inside JavaScript? That's JSX!

## JSX is NOT HTML

While JSX looks like HTML, there are key differences:
- Use \`className\` instead of \`class\`
- Use \`htmlFor\` instead of \`for\`
- All tags must be closed (\`<img />\` not \`<img>\`)
- Use camelCase for attributes (\`onClick\`, \`tabIndex\`)

## Embedding Expressions

Use curly braces \`{}\` to embed JavaScript:

\`\`\`jsx
const name = "React";
const element = <h1>Hello, {name}!</h1>;
// Renders: Hello, React!
\`\`\`

You can put any JavaScript expression inside the braces!`,
    codeExample: `function Greeting() {
  const name = "Learner";
  const currentHour = new Date().getHours();

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>It's {currentHour}:00 right now.</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  );
}`,
  },
  {
    id: 'jsx-elements',
    moduleId: 'jsx-basics',
    title: 'JSX Elements',
    order: 2,
    xpReward: 20,
    difficulty: 'beginner',
    content: `# JSX Elements

## Creating Elements

In JSX, you create elements just like HTML tags:

\`\`\`jsx
const heading = <h1>Welcome</h1>;
const paragraph = <p>This is a paragraph.</p>;
const image = <img src="cat.jpg" alt="A cat" />;
\`\`\`

## Nesting Elements

Elements can contain other elements:

\`\`\`jsx
const card = (
  <div>
    <h2>Card Title</h2>
    <p>Card content goes here.</p>
  </div>
);
\`\`\`

## The Single Root Rule

**Important**: JSX must have ONE root element!

\`\`\`jsx
// ❌ WRONG - Two root elements
return (
  <h1>Title</h1>
  <p>Content</p>
);

// ✅ CORRECT - Wrapped in a div
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// ✅ ALSO CORRECT - Using Fragment
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);
\`\`\`

## Fragments

Use \`<></>\` (Fragment) when you don't want an extra div in the DOM.`,
    codeExample: `function Card() {
  return (
    <div className="card">
      <h2>My First Card</h2>
      <p>This card has multiple elements!</p>
      <button>Click me</button>
    </div>
  );
}`,
  },
  {
    id: 'jsx-expressions',
    moduleId: 'jsx-basics',
    title: 'JavaScript in JSX',
    order: 3,
    xpReward: 25,
    difficulty: 'beginner',
    content: `# JavaScript Expressions in JSX

## Using Curly Braces

Anything inside \`{}\` is evaluated as JavaScript:

\`\`\`jsx
const price = 29.99;
const quantity = 3;

return <p>Total: ${'{'}price * quantity{'}'}</p>;
// Renders: Total: 89.97
\`\`\`

## What You Can Put in Curly Braces

- **Variables**: \`{name}\`
- **Math**: \`{2 + 2}\`
- **Function calls**: \`{getName()}\`
- **Ternary operators**: \`{isLoggedIn ? "Hi!" : "Login"}\`
- **Array methods**: \`{items.length}\`

## What You CANNOT Put in Curly Braces

- **Statements**: No \`if\`, \`for\`, \`while\` directly
- **Objects**: \`{myObject}\` won't render (objects aren't valid children)

## Conditional Rendering

Use ternary operators for inline conditions:

\`\`\`jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}
\`\`\`

## Short-circuit Evaluation

Use \`&&\` to conditionally render:

\`\`\`jsx
{hasNotifications && <span>🔔</span>}
\`\`\``,
    codeExample: `function PriceTag() {
  const price = 49.99;
  const discount = 0.2;
  const isOnSale = true;

  return (
    <div>
      {isOnSale && <span>🏷️ SALE!</span>}
      <p>Original: \${price}</p>
      <p>
        You pay: $
        {isOnSale
          ? (price * (1 - discount)).toFixed(2)
          : price
        }
      </p>
    </div>
  );
}`,
  },

  // Components & Props
  {
    id: 'components-intro',
    moduleId: 'components-props',
    title: 'What are Components?',
    order: 1,
    xpReward: 20,
    difficulty: 'beginner',
    content: `# What are Components?

Components are the **building blocks** of React applications. Think of them as custom, reusable HTML elements.

## Why Components?

- **Reusability**: Write once, use everywhere
- **Organization**: Break complex UIs into smaller pieces
- **Maintainability**: Each component handles one thing

## Function Components

The modern way to create components:

\`\`\`jsx
function Welcome() {
  return <h1>Hello!</h1>;
}
\`\`\`

## Rules for Components

1. **Name starts with capital letter**: \`Button\`, not \`button\`
2. **Return JSX**: Every component returns something to render
3. **One root element**: Just like regular JSX

## Using Components

Use your component like an HTML tag:

\`\`\`jsx
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}
\`\`\`

Each \`<Welcome />\` renders the same "Hello!" heading.`,
    codeExample: `// Define a component
function Greeting() {
  return <h1>Hello, React learner!</h1>;
}

// Use it multiple times
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <p>Components can be reused!</p>
    </div>
  );
}`,
  },
  {
    id: 'props-intro',
    moduleId: 'components-props',
    title: 'Passing Props',
    order: 2,
    xpReward: 25,
    difficulty: 'beginner',
    content: `# Props: Passing Data to Components

Props let you pass data to components, making them dynamic and reusable.

## What are Props?

Props (short for "properties") are like function arguments:

\`\`\`jsx
// Without props - static
function Greeting() {
  return <h1>Hello, stranger!</h1>;
}

// With props - dynamic
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

## Passing Props

Pass props like HTML attributes:

\`\`\`jsx
<Greeting name="Alice" />
<Greeting name="Bob" />
\`\`\`

## Receiving Props

Use destructuring to receive props:

\`\`\`jsx
function UserCard({ name, age, isOnline }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isOnline && <span>🟢 Online</span>}
    </div>
  );
}
\`\`\`

## Multiple Props

\`\`\`jsx
<UserCard
  name="Alice"
  age={25}
  isOnline={true}
/>
\`\`\`

**Note**: Strings use quotes, everything else uses curly braces!`,
    codeExample: `function ProfileCard({ name, role, avatar }) {
  return (
    <div className="profile">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <ProfileCard
        name="Alice"
        role="Developer"
        avatar="/alice.png"
      />
      <ProfileCard
        name="Bob"
        role="Designer"
        avatar="/bob.png"
      />
    </div>
  );
}`,
  },
  {
    id: 'children-prop',
    moduleId: 'components-props',
    title: 'Children Prop',
    order: 3,
    xpReward: 25,
    difficulty: 'intermediate',
    content: `# The Children Prop

The \`children\` prop lets you pass content between component tags.

## Basic Usage

\`\`\`jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Any content here!</p>
</Card>
\`\`\`

## Why Use Children?

- **Composition**: Build complex UIs from simple pieces
- **Flexibility**: Content can be anything
- **Wrapper components**: Cards, modals, layouts

## Combining with Other Props

\`\`\`jsx
function Alert({ type, children }) {
  const colors = {
    success: 'green',
    error: 'red',
    warning: 'orange',
  };

  return (
    <div style={{ background: colors[type] }}>
      {children}
    </div>
  );
}

<Alert type="success">
  <p>Operation completed!</p>
</Alert>
\`\`\``,
    codeExample: `function Button({ variant, children }) {
  const styles = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-black',
    danger: 'bg-red-500 text-white',
  };

  return (
    <button className={styles[variant]}>
      {children}
    </button>
  );
}

function App() {
  return (
    <div>
      <Button variant="primary">Save</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="secondary">
        <span>⚙️</span> Settings
      </Button>
    </div>
  );
}`,
  },

  // State & Hooks
  {
    id: 'state-intro',
    moduleId: 'state-hooks',
    title: 'Introduction to State',
    order: 1,
    xpReward: 25,
    difficulty: 'beginner',
    content: `# Introduction to State

State is data that **changes over time** and affects what's rendered.

## State vs Props

| Props | State |
|-------|-------|
| Passed from parent | Managed inside component |
| Read-only | Can be updated |
| Component receives them | Component owns them |

## The useState Hook

React provides \`useState\` to add state to components:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return <p>Count: {count}</p>;
}
\`\`\`

## How useState Works

\`\`\`jsx
const [value, setValue] = useState(initialValue);
\`\`\`

- \`value\`: Current state value
- \`setValue\`: Function to update the state
- \`initialValue\`: Starting value

## Updating State

**Always use the setter function!** Never modify state directly.

\`\`\`jsx
// ❌ WRONG
count = count + 1;

// ✅ CORRECT
setCount(count + 1);
\`\`\`

When you call the setter, React **re-renders** the component with the new value.`,
    codeExample: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}`,
  },
  {
    id: 'state-objects',
    moduleId: 'state-hooks',
    title: 'State with Objects',
    order: 2,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# State with Objects and Arrays

State can hold any value: numbers, strings, booleans, objects, arrays.

## Object State

\`\`\`jsx
const [user, setUser] = useState({
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
});
\`\`\`

## Updating Object State

**Important**: Create a new object, don't mutate!

\`\`\`jsx
// ❌ WRONG - Mutating
user.name = 'Bob';
setUser(user);

// ✅ CORRECT - New object with spread
setUser({ ...user, name: 'Bob' });
\`\`\`

## Array State

\`\`\`jsx
const [items, setItems] = useState(['Apple', 'Banana']);

// Add item
setItems([...items, 'Cherry']);

// Remove item
setItems(items.filter(item => item !== 'Banana'));

// Update item
setItems(items.map(item =>
  item === 'Apple' ? 'Green Apple' : item
));
\`\`\`

## Why No Mutation?

React detects changes by comparing references. If you mutate, the reference stays the same and React won't re-render!`,
    codeExample: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build an app', done: false },
  ]);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, done: !todo.done }
        : todo
    ));
  };

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          onClick={() => toggleTodo(todo.id)}
          style={{
            textDecoration: todo.done ? 'line-through' : 'none'
          }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`,
  },
  {
    id: 'multiple-state',
    moduleId: 'state-hooks',
    title: 'Multiple State Variables',
    order: 3,
    xpReward: 25,
    difficulty: 'intermediate',
    content: `# Multiple State Variables

You can use \`useState\` multiple times in a component!

## When to Split State

Split state when values **change independently**:

\`\`\`jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  // Each can update independently
}
\`\`\`

## When to Group State

Group state when values **change together**:

\`\`\`jsx
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // x and y always update together
  setPosition({ x: event.clientX, y: event.clientY });
}
\`\`\`

## Common Patterns

### Form with multiple fields
\`\`\`jsx
const [form, setForm] = useState({
  username: '',
  password: '',
});

const handleChange = (field, value) => {
  setForm({ ...form, [field]: value });
};
\`\`\`

### Loading states
\`\`\`jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
\`\`\``,
    codeExample: `import { useState } from 'react';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const isValid = username.length > 0
    && email.includes('@')
    && agreed;

  return (
    <form>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
        />
        I agree to terms
      </label>
      <button disabled={!isValid}>
        Register
      </button>
    </form>
  );
}`,
  },

  // Events
  {
    id: 'events-basics',
    moduleId: 'events',
    title: 'Event Handling Basics',
    order: 1,
    xpReward: 20,
    difficulty: 'beginner',
    content: `# Event Handling in React

React handles events similarly to HTML, with a few differences.

## Basic Syntax

\`\`\`jsx
<button onClick={handleClick}>
  Click me
</button>
\`\`\`

**Key differences from HTML:**
- **camelCase**: \`onClick\`, not \`onclick\`
- **Function reference**: Pass the function, don't call it

## Common Events

| Event | Description |
|-------|-------------|
| \`onClick\` | Mouse click |
| \`onChange\` | Input value changed |
| \`onSubmit\` | Form submitted |
| \`onMouseEnter\` | Mouse enters element |
| \`onMouseLeave\` | Mouse leaves element |
| \`onKeyDown\` | Key pressed |
| \`onFocus\` | Element gains focus |
| \`onBlur\` | Element loses focus |

## Inline vs Named Handlers

\`\`\`jsx
// Inline (simple actions)
<button onClick={() => setCount(count + 1)}>
  Add
</button>

// Named (complex logic)
function handleClick() {
  console.log('Clicked!');
  setCount(count + 1);
}

<button onClick={handleClick}>Add</button>
\`\`\`

## Common Mistake

\`\`\`jsx
// ❌ WRONG - Calls immediately!
<button onClick={handleClick()}>

// ✅ CORRECT - Passes reference
<button onClick={handleClick}>
\`\`\``,
    codeExample: `import { useState } from 'react';

function EventDemo() {
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setMessage('Button clicked!');
  };

  const handleMouseEnter = () => {
    setMessage('Mouse entered!');
  };

  const handleMouseLeave = () => {
    setMessage('Mouse left!');
  };

  return (
    <div>
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover or Click me
      </button>
      <p>{message}</p>
    </div>
  );
}`,
  },
  {
    id: 'events-object',
    moduleId: 'events',
    title: 'The Event Object',
    order: 2,
    xpReward: 25,
    difficulty: 'intermediate',
    content: `# The Event Object

Event handlers receive an event object with useful information.

## Accessing the Event

\`\`\`jsx
function handleClick(event) {
  console.log(event.target);  // Element that was clicked
  console.log(event.type);    // "click"
}

<button onClick={handleClick}>Click</button>
\`\`\`

## Common Event Properties

- \`event.target\` - The element that triggered the event
- \`event.target.value\` - Input field value
- \`event.preventDefault()\` - Stop default behavior
- \`event.stopPropagation()\` - Stop bubbling

## Form Events

\`\`\`jsx
function handleChange(event) {
  const value = event.target.value;
  setInput(value);
}

<input onChange={handleChange} />
\`\`\`

## Preventing Default Behavior

\`\`\`jsx
function handleSubmit(event) {
  event.preventDefault(); // Stop page reload
  console.log('Form submitted!');
}

<form onSubmit={handleSubmit}>
  <button type="submit">Submit</button>
</form>
\`\`\``,
    codeExample: `import { useState } from 'react';

function Form() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(input);
    setInput('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleChange}
          placeholder="Type something..."
        />
        <button type="submit">Submit</button>
      </form>
      {submitted && <p>You submitted: {submitted}</p>}
    </div>
  );
}`,
  },

  // Effects
  {
    id: 'effects-intro',
    moduleId: 'effects',
    title: 'Introduction to useEffect',
    order: 1,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# Introduction to useEffect

\`useEffect\` lets you perform **side effects** in components.

## What are Side Effects?

Side effects are anything that affects something outside the component:
- Fetching data from an API
- Setting up subscriptions
- Changing the document title
- Accessing browser APIs

## Basic Syntax

\`\`\`jsx
import { useEffect } from 'react';

useEffect(() => {
  // Side effect code here
  document.title = 'My App';
});
\`\`\`

## When Does it Run?

By default, useEffect runs **after every render**.

\`\`\`jsx
function Counter({ count }) {
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  });
  // Updates title after every render
}
\`\`\`

## The Dependency Array

Control when the effect runs with dependencies:

\`\`\`jsx
// Runs on every render
useEffect(() => { ... });

// Runs only on mount
useEffect(() => { ... }, []);

// Runs when 'count' changes
useEffect(() => { ... }, [count]);
\`\`\``,
    codeExample: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    document.title = \`Timer: \${seconds}s\`;
  }, [seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []); // Empty array = run once on mount

  return <h1>{seconds} seconds</h1>;
}`,
  },
  {
    id: 'effects-cleanup',
    moduleId: 'effects',
    title: 'Effect Cleanup',
    order: 2,
    xpReward: 30,
    difficulty: 'advanced',
    content: `# Effect Cleanup

Some effects need **cleanup** to avoid memory leaks and bugs.

## When to Clean Up

- Event listeners
- Timers and intervals
- Subscriptions
- WebSocket connections

## Cleanup Function

Return a function from useEffect to clean up:

\`\`\`jsx
useEffect(() => {
  const handleResize = () => {
    console.log(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
\`\`\`

## When Cleanup Runs

1. **Before the next effect** runs
2. **When component unmounts**

## Timer Example

\`\`\`jsx
useEffect(() => {
  const timer = setTimeout(() => {
    setMessage('Time is up!');
  }, 3000);

  return () => clearTimeout(timer);
}, []);
\`\`\`

Without cleanup, you might set state on an unmounted component!`,
    codeExample: `import { useState, useEffect } from 'react';

function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup: remove listener when component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div>
      Mouse position: {position.x}, {position.y}
    </div>
  );
}`,
  },

  // TypeScript
  {
    id: 'ts-basics',
    moduleId: 'typescript-react',
    title: 'TypeScript Basics for React',
    order: 1,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# TypeScript Basics for React

TypeScript adds **static types** to JavaScript, catching errors before runtime.

## Why TypeScript?

- Catch bugs during development
- Better autocomplete in editors
- Self-documenting code
- Safer refactoring

## Basic Types

\`\`\`typescript
// Primitives
let name: string = 'Alice';
let age: number = 25;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: string[] = ['Alice', 'Bob'];

// Objects
let user: { name: string; age: number } = {
  name: 'Alice',
  age: 25,
};
\`\`\`

## Interfaces

Define object shapes:

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Optional property
}

const user: User = { name: 'Alice', age: 25 };
\`\`\`

## Type Inference

TypeScript often infers types automatically:

\`\`\`typescript
const count = 0;  // TypeScript knows it's a number
const name = 'Alice';  // TypeScript knows it's a string
\`\`\``,
    codeExample: `// Define types for our data
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// TypeScript knows todos is Todo[]
const todos: Todo[] = [
  { id: 1, text: 'Learn TypeScript', completed: false },
  { id: 2, text: 'Use with React', completed: false },
];

// Function with typed parameters and return
function toggleTodo(todos: Todo[], id: number): Todo[] {
  return todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  );
}`,
  },
  {
    id: 'ts-components',
    moduleId: 'typescript-react',
    title: 'Typing React Components',
    order: 2,
    xpReward: 35,
    difficulty: 'advanced',
    content: `# Typing React Components

## Typing Props

\`\`\`typescript
interface GreetingProps {
  name: string;
  age?: number;  // Optional
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
}
\`\`\`

## Typing Children

\`\`\`typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
\`\`\`

## Typing State

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
\`\`\`

Often TypeScript infers the type from the initial value!

## Typing Events

\`\`\`typescript
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}

function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log('Clicked!');
}
\`\`\``,
    codeExample: `import { useState } from 'react';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
}

function TodoItem({ id, text, completed, onToggle }: TodoItemProps) {
  return (
    <li
      onClick={() => onToggle(id)}
      style={{ textDecoration: completed ? 'line-through' : 'none' }}
    >
      {text}
    </li>
  );
}

function TodoList() {
  const [todos, setTodos] = useState<TodoItemProps[]>([]);

  const handleToggle = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} {...todo} onToggle={handleToggle} />
      ))}
    </ul>
  );
}`,
  },

  // Lists & Keys
  {
    id: 'lists-rendering',
    moduleId: 'lists-keys',
    title: 'Rendering Lists',
    order: 1,
    xpReward: 25,
    difficulty: 'beginner',
    content: `# Rendering Lists in React

## The map() Method

Use JavaScript's \`map()\` to transform arrays into JSX:

\`\`\`jsx
const items = ['Apple', 'Banana', 'Cherry'];

function FruitList() {
  return (
    <ul>
      {items.map(item => <li>{item}</li>)}
    </ul>
  );
}
\`\`\`

## Why map()?

- Transforms each array element into JSX
- Returns a new array of elements
- Perfect for dynamic lists`,
    codeExample: `function ShoppingList() {
  const items = ['Milk', 'Bread', 'Eggs', 'Butter'];

  return (
    <ul>
      {items.map(item => (
        <li>{item}</li>
      ))}
    </ul>
  );
}`,
  },
  {
    id: 'lists-keys',
    moduleId: 'lists-keys',
    title: 'Understanding Keys',
    order: 2,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# Understanding Keys

## Why Keys Matter

Keys help React identify which items changed, were added, or removed.

\`\`\`jsx
// Always add a key when mapping
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
\`\`\`

## Key Rules

1. Keys must be **unique** among siblings
2. Keys should be **stable** (don't use random values)
3. Don't use array **index** as key (usually)

## Good vs Bad Keys

\`\`\`jsx
// Bad - index can change
{items.map((item, index) => <li key={index}>{item}</li>)}

// Good - stable unique id
{items.map(item => <li key={item.id}>{item.name}</li>)}
\`\`\``,
    codeExample: `function TodoList() {
  const todos = [
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build an app' },
    { id: 3, text: 'Deploy it' },
  ];

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
  },
  {
    id: 'lists-filtering',
    moduleId: 'lists-keys',
    title: 'Filtering & Sorting Lists',
    order: 3,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# Filtering & Sorting Lists

## Filtering with filter()

\`\`\`jsx
const completedTodos = todos.filter(todo => todo.completed);
\`\`\`

## Sorting with sort()

\`\`\`jsx
const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
\`\`\`

## Combining Operations

Chain filter, sort, and map together:

\`\`\`jsx
{items
  .filter(item => item.active)
  .sort((a, b) => b.priority - a.priority)
  .map(item => <Item key={item.id} {...item} />)}
\`\`\``,
    codeExample: `function FilteredList() {
  const products = [
    { id: 1, name: 'Apple', price: 1.5, inStock: true },
    { id: 2, name: 'Banana', price: 0.5, inStock: true },
    { id: 3, name: 'Cherry', price: 3.0, inStock: false },
  ];

  const availableProducts = products
    .filter(p => p.inStock)
    .sort((a, b) => a.price - b.price);

  return (
    <ul>
      {availableProducts.map(product => (
        <li key={product.id}>
          {product.name} - \${product.price}
        </li>
      ))}
    </ul>
  );
}`,
  },

  // Forms & Validation
  {
    id: 'forms-controlled',
    moduleId: 'forms-validation',
    title: 'Controlled Components',
    order: 1,
    xpReward: 25,
    difficulty: 'beginner',
    content: `# Controlled Components

## What is a Controlled Component?

A form element whose value is controlled by React state.

\`\`\`jsx
function NameForm() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
\`\`\`

## Benefits

- Single source of truth
- Instant validation
- Conditional form logic`,
    codeExample: `import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}`,
  },
  {
    id: 'forms-validation',
    moduleId: 'forms-validation',
    title: 'Form Validation',
    order: 2,
    xpReward: 35,
    difficulty: 'intermediate',
    content: `# Form Validation

## Real-time Validation

Validate as the user types:

\`\`\`jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleChange = (e) => {
  const value = e.target.value;
  setEmail(value);

  if (!value.includes('@')) {
    setError('Invalid email');
  } else {
    setError('');
  }
};
\`\`\`

## Submit Validation

Validate on form submission to check all fields at once.`,
    codeExample: `import { useState } from 'react';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Invalid email format';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    alert('Form submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
}`,
  },
  {
    id: 'forms-multiple',
    moduleId: 'forms-validation',
    title: 'Multiple Form Fields',
    order: 3,
    xpReward: 35,
    difficulty: 'intermediate',
    content: `# Managing Multiple Fields

## Single State Object

Instead of separate useState for each field:

\`\`\`jsx
const [form, setForm] = useState({
  name: '',
  email: '',
  message: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};
\`\`\`

This pattern scales well for complex forms!`,
    codeExample: `import { useState } from 'react';

function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  );
}`,
  },

  // Context API
  {
    id: 'context-intro',
    moduleId: 'context-api',
    title: 'Introduction to Context',
    order: 1,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# Introduction to Context

## The Prop Drilling Problem

Passing props through many levels is tedious:

\`\`\`jsx
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserInfo user={user} />
    </Sidebar>
  </Layout>
</App>
\`\`\`

## Context to the Rescue

Context provides a way to pass data through the component tree without passing props.

\`\`\`jsx
const UserContext = createContext(null);
\`\`\``,
    codeExample: `import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
    }}>
      I'm {theme} themed!
    </button>
  );
}`,
  },
  {
    id: 'context-provider',
    moduleId: 'context-api',
    title: 'Creating Providers',
    order: 2,
    xpReward: 35,
    difficulty: 'intermediate',
    content: `# Creating Context Providers

## Provider Pattern

Create a provider component that wraps your app:

\`\`\`jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
\`\`\`

## Custom Hook

Create a custom hook for easier consumption:

\`\`\`jsx
export function useTheme() {
  return useContext(ThemeContext);
}
\`\`\``,
    codeExample: `import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}`,
  },
  {
    id: 'context-patterns',
    moduleId: 'context-api',
    title: 'Context Best Practices',
    order: 3,
    xpReward: 35,
    difficulty: 'advanced',
    content: `# Context Best Practices

## When to Use Context

- Theme data (dark/light mode)
- User authentication
- Locale/language settings
- Feature flags

## When NOT to Use Context

- Frequently changing data (use state management)
- Data only needed by one component
- Performance-critical updates

## Split Contexts

Separate state and dispatch to avoid unnecessary re-renders.`,
    codeExample: `import { createContext, useContext, useReducer } from 'react';

const TodosContext = createContext(null);
const TodosDispatchContext = createContext(null);

function todosReducer(todos, action) {
  switch (action.type) {
    case 'add':
      return [...todos, { id: Date.now(), text: action.text }];
    case 'delete':
      return todos.filter(t => t.id !== action.id);
    default:
      throw new Error('Unknown action');
  }
}

export function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, []);

  return (
    <TodosContext.Provider value={todos}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>
  );
}`,
  },

  // Custom Hooks
  {
    id: 'hooks-intro',
    moduleId: 'custom-hooks',
    title: 'Creating Custom Hooks',
    order: 1,
    xpReward: 35,
    difficulty: 'intermediate',
    content: `# Creating Custom Hooks

## What are Custom Hooks?

Functions that use React hooks to encapsulate reusable logic.

## Rules

1. Name must start with "use"
2. Can call other hooks
3. Share stateful logic, not state itself

## Example: useToggle

\`\`\`jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}
\`\`\``,
    codeExample: `import { useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

function Counter() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
  },
  {
    id: 'hooks-patterns',
    moduleId: 'custom-hooks',
    title: 'Common Hook Patterns',
    order: 2,
    xpReward: 40,
    difficulty: 'advanced',
    content: `# Common Hook Patterns

## useLocalStorage

Persist state to localStorage:

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

## useFetch

Handle data fetching with loading and error states.`,
    codeExample: `import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

function UserList() {
  const { data, loading, error } = useFetch('/api/users');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}`,
  },

  // Performance
  {
    id: 'perf-memo',
    moduleId: 'performance',
    title: 'React.memo',
    order: 1,
    xpReward: 35,
    difficulty: 'intermediate',
    content: `# React.memo

## Preventing Unnecessary Re-renders

\`React.memo\` is a higher-order component that memoizes a component:

\`\`\`jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  // Only re-renders if props change
});
\`\`\`

## When to Use

- Component renders often with same props
- Component is expensive to render
- Component is pure (same props = same output)`,
    codeExample: `import { memo, useState } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  console.log('ExpensiveComponent rendered');
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveComponent data={data} />
    </div>
  );
}`,
  },
  {
    id: 'perf-usememo',
    moduleId: 'performance',
    title: 'useMemo & useCallback',
    order: 2,
    xpReward: 40,
    difficulty: 'advanced',
    content: `# useMemo & useCallback

## useMemo

Memoize expensive calculations:

\`\`\`jsx
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`

## useCallback

Memoize functions to prevent child re-renders:

\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
\`\`\``,
    codeExample: `import { useState, useMemo, useCallback, memo } from 'react';

const Button = memo(function Button({ onClick, children }) {
  console.log('Button rendered:', children);
  return <button onClick={onClick}>{children}</button>;
});

function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  const expensiveSum = useMemo(() => {
    console.log('Computing sum...');
    return items.reduce((a, b) => a + b, 0);
  }, [items]);

  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>Sum: {expensiveSum}</p>
      <p>Count: {count}</p>
      <Button onClick={handleIncrement}>Increment</Button>
    </div>
  );
}`,
  },
  {
    id: 'perf-best-practices',
    moduleId: 'performance',
    title: 'Performance Best Practices',
    order: 3,
    xpReward: 35,
    difficulty: 'advanced',
    content: `# Performance Best Practices

## Key Principles

1. **Measure first** - Use React DevTools Profiler
2. **Avoid premature optimization**
3. **Keep state local** when possible
4. **Use keys properly** in lists

## Common Issues

- Creating objects/arrays in render
- Anonymous functions in props
- Missing dependency arrays
- Over-fetching data`,
    codeExample: `import { useState, useMemo, useCallback } from 'react';

function OptimizedList() {
  const [filter, setFilter] = useState('');
  const [items] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ]);

  // Memoize filtered results
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // Memoize style object
  const containerStyle = useMemo(() => ({
    padding: '20px',
    border: '1px solid #ccc',
  }), []);

  return (
    <div style={containerStyle}>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
  },

  // React Router
  {
    id: 'router-basics',
    moduleId: 'react-router',
    title: 'Router Basics',
    order: 1,
    xpReward: 30,
    difficulty: 'intermediate',
    content: `# React Router Basics

## Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\``,
    codeExample: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  {
    id: 'router-params',
    moduleId: 'react-router',
    title: 'Route Parameters',
    order: 2,
    xpReward: 35,
    difficulty: 'intermediate',
    content: `# Route Parameters

## Dynamic Routes

Use \`:param\` syntax for dynamic segments:

\`\`\`jsx
<Route path="/user/:userId" element={<UserProfile />} />
\`\`\`

## useParams Hook

Access parameters in your component:

\`\`\`jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  return <h1>User: {userId}</h1>;
}
\`\`\``,
    codeExample: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function ProductList() {
  const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' },
  ];

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>
          <Link to={\`/product/\${p.id}\`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  );
}

function ProductDetail() {
  const { productId } = useParams();
  return <h1>Product ID: {productId}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  {
    id: 'router-navigation',
    moduleId: 'react-router',
    title: 'Programmatic Navigation',
    order: 3,
    xpReward: 35,
    difficulty: 'advanced',
    content: `# Programmatic Navigation

## useNavigate Hook

Navigate programmatically after an action:

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
    navigate('/dashboard');
  };
}
\`\`\`

## Navigation Options

- \`navigate('/path')\` - Go to path
- \`navigate(-1)\` - Go back
- \`navigate('/path', { replace: true })\` - Replace history`,
    codeExample: `import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    const success = Math.random() > 0.5;
    if (success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Login failed!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}`,
  },
];

export const exercises: Exercise[] = [
  // JSX Exercises
  {
    id: 'jsx-ex-1',
    lessonId: 'jsx-intro',
    moduleId: 'jsx-basics',
    title: 'Your First JSX',
    difficulty: 'easy',
    xpReward: 20,
    description: 'Create a simple component that displays a greeting.',
    instructions: `Create a component called \`Greeting\` that returns a heading with the text "Welcome to React!".

The component should render an h1 element.`,
    starterCode: `function Greeting() {
  // Return an h1 with "Welcome to React!"

}`,
    solution: `function Greeting() {
  return <h1>Welcome to React!</h1>;
}`,
    hints: [
      'Use the return keyword to return JSX',
      'The h1 tag syntax is <h1>text here</h1>',
    ],
    validationPrompt: 'Check if the code defines a Greeting function that returns an h1 element containing "Welcome to React!"',
  },
  {
    id: 'jsx-ex-2',
    lessonId: 'jsx-expressions',
    moduleId: 'jsx-basics',
    title: 'Embedding Expressions',
    difficulty: 'easy',
    xpReward: 25,
    description: 'Use JavaScript expressions inside JSX.',
    instructions: `Create a \`ProductPrice\` component that:
1. Has a variable \`price\` set to 29.99
2. Has a variable \`quantity\` set to 3
3. Displays: "Total: $X" where X is price * quantity`,
    starterCode: `function ProductPrice() {
  // Create price and quantity variables
  // Return a paragraph showing the total

}`,
    solution: `function ProductPrice() {
  const price = 29.99;
  const quantity = 3;
  return <p>Total: \${price * quantity}</p>;
}`,
    hints: [
      'Use const to declare variables',
      'Use curly braces {} to embed JavaScript expressions in JSX',
      'You can do math inside the curly braces',
    ],
    validationPrompt: 'Check if the code defines ProductPrice with price=29.99, quantity=3, and displays their product in a paragraph',
  },
  {
    id: 'jsx-ex-3',
    lessonId: 'jsx-elements',
    moduleId: 'jsx-basics',
    title: 'Building a Card',
    difficulty: 'medium',
    xpReward: 30,
    description: 'Create a card component with multiple elements.',
    instructions: `Create a \`UserCard\` component that returns a div containing:
1. An h2 with "John Doe"
2. A paragraph with "Software Developer"
3. A span with the email "john@example.com"

All wrapped in a single div.`,
    starterCode: `function UserCard() {
  // Return a div containing h2, p, and span

}`,
    solution: `function UserCard() {
  return (
    <div>
      <h2>John Doe</h2>
      <p>Software Developer</p>
      <span>john@example.com</span>
    </div>
  );
}`,
    hints: [
      'Wrap multiple elements in a parent div',
      'Use parentheses when returning multi-line JSX',
    ],
    validationPrompt: 'Check if the code returns a div with h2 "John Doe", p "Software Developer", and span "john@example.com"',
  },

  // Components & Props Exercises
  {
    id: 'props-ex-1',
    lessonId: 'props-intro',
    moduleId: 'components-props',
    title: 'Using Props',
    difficulty: 'easy',
    xpReward: 25,
    description: 'Create a component that uses props.',
    instructions: `Create a \`Welcome\` component that:
1. Accepts a \`name\` prop
2. Returns: "Hello, {name}!" in an h1`,
    starterCode: `function Welcome(/* add props here */) {
  // Return greeting with the name

}`,
    solution: `function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}`,
    hints: [
      'Destructure props in the function parameters: { name }',
      'Use curly braces to embed the name variable in JSX',
    ],
    validationPrompt: 'Check if Welcome component accepts a name prop and displays "Hello, {name}!" in an h1',
  },
  {
    id: 'props-ex-2',
    lessonId: 'props-intro',
    moduleId: 'components-props',
    title: 'Multiple Props',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Work with multiple props and conditional rendering.',
    instructions: `Create a \`Product\` component that:
1. Accepts \`name\` (string), \`price\` (number), and \`inStock\` (boolean) props
2. Displays the name in an h3
3. Displays the price in a paragraph as "$X"
4. If inStock is true, show a green "In Stock" span, otherwise show red "Out of Stock"`,
    starterCode: `function Product({ name, price, inStock }) {
  // Display product info with conditional stock status

}`,
    solution: `function Product({ name, price, inStock }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>\${price}</p>
      <span style={{ color: inStock ? 'green' : 'red' }}>
        {inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  );
}`,
    hints: [
      'Use the ternary operator: condition ? valueIfTrue : valueIfFalse',
      'You can use inline styles with the style prop',
    ],
    validationPrompt: 'Check if Product displays name, price with $, and conditionally shows stock status with appropriate colors',
  },

  // State Exercises
  {
    id: 'state-ex-1',
    lessonId: 'state-intro',
    moduleId: 'state-hooks',
    title: 'Simple Counter',
    difficulty: 'easy',
    xpReward: 30,
    description: 'Create a counter using useState.',
    instructions: `Create a \`Counter\` component that:
1. Has a count state starting at 0
2. Displays the current count
3. Has a button that increments the count when clicked`,
    starterCode: `import { useState } from 'react';

function Counter() {
  // Create count state
  // Return count display and increment button

}`,
    solution: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    hints: [
      'Use useState(0) to create state starting at 0',
      'Destructure as [count, setCount]',
      'Use onClick with an arrow function to update state',
    ],
    validationPrompt: 'Check if Counter uses useState, displays count, and has a button that increments it',
  },
  {
    id: 'state-ex-2',
    lessonId: 'state-objects',
    moduleId: 'state-hooks',
    title: 'Toggle Component',
    difficulty: 'easy',
    xpReward: 30,
    description: 'Create a toggle switch.',
    instructions: `Create a \`Toggle\` component that:
1. Has an \`isOn\` state starting as false
2. Shows "ON" when true, "OFF" when false
3. Has a button that toggles the state`,
    starterCode: `import { useState } from 'react';

function Toggle() {
  // Create isOn state
  // Return status and toggle button

}`,
    solution: `import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <p>{isOn ? 'ON' : 'OFF'}</p>
      <button onClick={() => setIsOn(!isOn)}>
        Toggle
      </button>
    </div>
  );
}`,
    hints: [
      'Use useState(false) for a boolean state',
      'Use the ! operator to flip a boolean: !isOn',
    ],
    validationPrompt: 'Check if Toggle has boolean state, displays ON/OFF based on state, and button toggles it',
  },

  // Events Exercises
  {
    id: 'events-ex-1',
    lessonId: 'events-basics',
    moduleId: 'events',
    title: 'Click Handler',
    difficulty: 'easy',
    xpReward: 25,
    description: 'Handle a button click event.',
    instructions: `Create a \`ClickMe\` component that:
1. Has a \`clicked\` state (boolean, starts false)
2. Shows "Not clicked yet" when false
3. Shows "You clicked!" when true
4. Has a button that sets clicked to true`,
    starterCode: `import { useState } from 'react';

function ClickMe() {
  // Create clicked state
  // Return message and button

}`,
    solution: `import { useState } from 'react';

function ClickMe() {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <p>{clicked ? 'You clicked!' : 'Not clicked yet'}</p>
      <button onClick={() => setClicked(true)}>
        Click me
      </button>
    </div>
  );
}`,
    hints: [
      'Use useState(false) for the initial state',
      'The onClick handler should call setClicked(true)',
    ],
    validationPrompt: 'Check if ClickMe tracks click state and shows appropriate message before/after clicking',
  },
  {
    id: 'events-ex-2',
    lessonId: 'events-object',
    moduleId: 'events',
    title: 'Controlled Input',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Create a controlled input field.',
    instructions: `Create a \`NameInput\` component that:
1. Has a \`name\` state starting as empty string
2. Has an input field that updates the name state on change
3. Shows "Hello, {name}!" below the input (or "Hello, stranger!" if empty)`,
    starterCode: `import { useState } from 'react';

function NameInput() {
  // Create name state
  // Return input and greeting

}`,
    solution: `import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`,
    hints: [
      'Use value={name} to make it a controlled input',
      'Access the input value with event.target.value',
      'Use || to provide a default value',
    ],
    validationPrompt: 'Check if NameInput has controlled input that updates state and shows dynamic greeting',
  },

  // Effects Exercises
  {
    id: 'effects-ex-1',
    lessonId: 'effects-intro',
    moduleId: 'effects',
    title: 'Document Title',
    difficulty: 'easy',
    xpReward: 30,
    description: 'Update the document title with useEffect.',
    instructions: `Create a \`TitleUpdater\` component that:
1. Has a \`count\` state starting at 0
2. Uses useEffect to update document.title to "Count: {count}"
3. Has a button to increment the count`,
    starterCode: `import { useState, useEffect } from 'react';

function TitleUpdater() {
  // Create count state
  // Use useEffect to update document.title
  // Return count display and button

}`,
    solution: `import { useState, useEffect } from 'react';

function TitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    hints: [
      'Put document.title update inside useEffect',
      'Add [count] as dependency array so it runs when count changes',
    ],
    validationPrompt: 'Check if TitleUpdater uses useEffect to update document.title when count changes',
  },

  // TypeScript Exercises
  {
    id: 'ts-ex-1',
    lessonId: 'ts-components',
    moduleId: 'typescript-react',
    title: 'Typed Props',
    difficulty: 'medium',
    xpReward: 40,
    description: 'Create a component with typed props.',
    instructions: `Create a typed \`UserProfile\` component:
1. Define a \`UserProfileProps\` interface with:
   - name: string
   - age: number
   - isAdmin: boolean (optional)
2. Create the component using these props
3. Display name and age, and show "Admin" badge if isAdmin is true`,
    starterCode: `// Define interface here

function UserProfile(/* typed props */) {
  // Return user profile display

}`,
    solution: `interface UserProfileProps {
  name: string;
  age: number;
  isAdmin?: boolean;
}

function UserProfile({ name, age, isAdmin }: UserProfileProps) {
  return (
    <div>
      <h2>{name} {isAdmin && '(Admin)'}</h2>
      <p>Age: {age}</p>
    </div>
  );
}`,
    hints: [
      'Use interface to define the prop types',
      'Use ? after property name to make it optional',
      'Add the type annotation after the props destructuring',
    ],
    validationPrompt: 'Check if UserProfileProps interface is defined correctly and component uses typed props',
  },

  // Lists & Keys Exercises
  {
    id: 'lists-ex-1',
    lessonId: 'lists-rendering',
    moduleId: 'lists-keys',
    title: 'Render a List',
    difficulty: 'easy',
    xpReward: 20,
    description: 'Create a component that renders a list of items',
    instructions: `Create a ColorList component that renders an unordered list of colors.
The colors array is provided: ['Red', 'Green', 'Blue', 'Yellow'].
Use map() to render each color as a list item.`,
    starterCode: `function ColorList() {
  const colors = ['Red', 'Green', 'Blue', 'Yellow'];

  return (
    // Render an ul with li items for each color
  );
}`,
    solution: `function ColorList() {
  const colors = ['Red', 'Green', 'Blue', 'Yellow'];

  return (
    <ul>
      {colors.map(color => (
        <li key={color}>{color}</li>
      ))}
    </ul>
  );
}`,
    hints: ['Use the map() method on the colors array', 'Return a <li> element for each color', 'Add a key prop to each li'],
    validationPrompt: 'Check if component uses map() to render li elements inside a ul',
  },
  {
    id: 'lists-ex-2',
    lessonId: 'lists-keys',
    moduleId: 'lists-keys',
    title: 'Add Proper Keys',
    difficulty: 'medium',
    xpReward: 25,
    description: 'Add proper keys to a list of objects',
    instructions: `Fix the UserList component to use proper keys.
Each user object has an id, name, and email.
Use the user's id as the key instead of the array index.`,
    starterCode: `function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];

  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}`,
    solution: `function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}`,
    hints: ['Use user.id as the key', 'Remove the index parameter', 'Each user has a unique id property'],
    validationPrompt: 'Check if key={user.id} is used instead of key={index}',
  },
  {
    id: 'lists-ex-3',
    lessonId: 'lists-filtering',
    moduleId: 'lists-keys',
    title: 'Filter a List',
    difficulty: 'medium',
    xpReward: 30,
    description: 'Filter and display only active items',
    instructions: `Create a component that shows only active tasks.
Use filter() before map() to show only tasks where active is true.`,
    starterCode: `function ActiveTasks() {
  const tasks = [
    { id: 1, title: 'Learn React', active: true },
    { id: 2, title: 'Do laundry', active: false },
    { id: 3, title: 'Build app', active: true },
    { id: 4, title: 'Clean room', active: false },
  ];

  return (
    <ul>
      {/* Filter to show only active tasks */}
    </ul>
  );
}`,
    solution: `function ActiveTasks() {
  const tasks = [
    { id: 1, title: 'Learn React', active: true },
    { id: 2, title: 'Do laundry', active: false },
    { id: 3, title: 'Build app', active: true },
    { id: 4, title: 'Clean room', active: false },
  ];

  return (
    <ul>
      {tasks
        .filter(task => task.active)
        .map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
    </ul>
  );
}`,
    hints: ['Use filter() before map()', 'Filter tasks where task.active is true', 'Chain filter and map together'],
    validationPrompt: 'Check if filter() is used to show only active tasks',
  },

  // Forms & Validation Exercises
  {
    id: 'forms-ex-1',
    lessonId: 'forms-controlled',
    moduleId: 'forms-validation',
    title: 'Controlled Input',
    difficulty: 'easy',
    xpReward: 20,
    description: 'Create a controlled text input',
    instructions: `Create a NameInput component with a controlled input.
Display the current value below the input as: "Hello, {name}!"
If empty, display "Hello, stranger!"`,
    starterCode: `import { useState } from 'react';

function NameInput() {
  // Add state for the name

  return (
    <div>
      {/* Add controlled input */}
      {/* Display greeting below */}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`,
    hints: ['Use useState to store the name', 'Set value and onChange on the input', 'Use a conditional for the greeting'],
    validationPrompt: 'Check if useState is used and input has value and onChange props',
  },
  {
    id: 'forms-ex-2',
    lessonId: 'forms-validation',
    moduleId: 'forms-validation',
    title: 'Email Validation',
    difficulty: 'medium',
    xpReward: 30,
    description: 'Add validation to an email input',
    instructions: `Add email validation to the form.
Show an error message if the email doesn't contain '@'.
The error should appear below the input in red.`,
    starterCode: `import { useState } from 'react';

function EmailForm() {
  const [email, setEmail] = useState('');
  // Add error state

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Add validation logic
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Enter email"
      />
      {/* Show error if invalid */}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function EmailForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !value.includes('@')) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Enter email"
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}`,
    hints: ['Add a second useState for the error', 'Check if email includes @ in handleChange', 'Conditionally render the error message'],
    validationPrompt: 'Check if error state exists and validation checks for @ symbol',
  },
  {
    id: 'forms-ex-3',
    lessonId: 'forms-multiple',
    moduleId: 'forms-validation',
    title: 'Multi-Field Form',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Create a form with multiple controlled fields',
    instructions: `Create a registration form with username and password fields.
Use a single state object to manage both fields.
Use a single handleChange function for both inputs.`,
    starterCode: `import { useState } from 'react';

function RegisterForm() {
  // Use a single state object for both fields

  const handleChange = (e) => {
    // Handle changes for any field
  };

  return (
    <form>
      <input name="username" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}`,
    solution: `import { useState } from 'react';

function RegisterForm() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}`,
    hints: ['Use an object in useState with username and password', 'Use e.target.name to identify which field changed', 'Spread previous state and update the specific field'],
    validationPrompt: 'Check if single state object is used with spread operator in handleChange',
  },
  {
    id: 'forms-ex-4',
    lessonId: 'forms-validation',
    moduleId: 'forms-validation',
    title: 'Submit Validation',
    difficulty: 'hard',
    xpReward: 40,
    description: 'Validate form on submission',
    instructions: `Add submit validation to the form.
Check that both username (min 3 chars) and password (min 6 chars) are valid.
Show errors and prevent submission if invalid.`,
    starterCode: `import { useState } from 'react';

function ValidatedForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic
    // Set errors if invalid
    // Alert 'Success!' if valid
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={form.username}
        onChange={(e) => setForm({...form, username: e.target.value})}
        placeholder="Username"
      />
      {errors.username && <p style={{color:'red'}}>{errors.username}</p>}
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({...form, password: e.target.value})}
        placeholder="Password"
      />
      {errors.password && <p style={{color:'red'}}>{errors.password}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}`,
    solution: `import { useState } from 'react';

function ValidatedForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Success!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={form.username}
        onChange={(e) => setForm({...form, username: e.target.value})}
        placeholder="Username"
      />
      {errors.username && <p style={{color:'red'}}>{errors.username}</p>}
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({...form, password: e.target.value})}
        placeholder="Password"
      />
      {errors.password && <p style={{color:'red'}}>{errors.password}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}`,
    hints: ['Create an errors object in handleSubmit', 'Check length of username and password', 'Only alert Success if no errors'],
    validationPrompt: 'Check if handleSubmit validates both fields with length checks',
  },

  // Context API Exercises
  {
    id: 'context-ex-1',
    lessonId: 'context-intro',
    moduleId: 'context-api',
    title: 'Use Context',
    difficulty: 'medium',
    xpReward: 30,
    description: 'Consume a context value',
    instructions: `Complete the ThemedBox component to use the ThemeContext.
Apply different background colors based on the theme value.
dark theme = black background, white text
light theme = white background, black text`,
    starterCode: `import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedBox() {
  // Get the theme from context

  return (
    <div style={{ padding: '20px' }}>
      Current theme is displayed here
    </div>
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedBox />
    </ThemeContext.Provider>
  );
}`,
    solution: `import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedBox() {
  const theme = useContext(ThemeContext);

  return (
    <div style={{
      padding: '20px',
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    }}>
      Current theme: {theme}
    </div>
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedBox />
    </ThemeContext.Provider>
  );
}`,
    hints: ['Use useContext(ThemeContext) to get the theme', 'Apply conditional styles based on theme value', 'Check if theme equals dark'],
    validationPrompt: 'Check if useContext is used and styles change based on theme',
  },
  {
    id: 'context-ex-2',
    lessonId: 'context-provider',
    moduleId: 'context-api',
    title: 'Create a Provider',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Create a context provider with state',
    instructions: `Complete the CounterProvider to share count state.
The provider should expose count, increment, and decrement.
Complete the useCounter hook to consume the context.`,
    starterCode: `import { createContext, useContext, useState } from 'react';

const CounterContext = createContext(null);

function CounterProvider({ children }) {
  // Add count state
  // Create increment and decrement functions
  // Return provider with value
}

function useCounter() {
  // Return the context value
}

function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}`,
    solution: `import { createContext, useContext, useState } from 'react';

const CounterContext = createContext(null);

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);

  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  );
}

function useCounter() {
  return useContext(CounterContext);
}

function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}`,
    hints: ['Add useState for count in CounterProvider', 'Pass an object with count, increment, decrement to Provider value', 'useCounter should return useContext(CounterContext)'],
    validationPrompt: 'Check if CounterProvider has state and passes count/increment/decrement',
  },
  {
    id: 'context-ex-3',
    lessonId: 'context-patterns',
    moduleId: 'context-api',
    title: 'Theme Toggle',
    difficulty: 'hard',
    xpReward: 40,
    description: 'Build a complete theme toggle system',
    instructions: `Create a ThemeProvider that allows toggling between light and dark themes.
Include a toggleTheme function in the context value.
The ThemeToggle component should show the current theme and a button to toggle.`,
    starterCode: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  // Add theme state (default: 'light')
  // Create toggleTheme function
  // Return provider
}

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}`,
    solution: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}`,
    hints: ['useState with initial value light', 'toggleTheme should flip between light and dark', 'Pass both theme and toggleTheme in provider value'],
    validationPrompt: 'Check if ThemeProvider has toggleTheme function that switches between light/dark',
  },

  // Custom Hooks Exercises
  {
    id: 'hooks-ex-1',
    lessonId: 'hooks-intro',
    moduleId: 'custom-hooks',
    title: 'useToggle Hook',
    difficulty: 'medium',
    xpReward: 30,
    description: 'Create a useToggle custom hook',
    instructions: `Create a useToggle hook that manages a boolean state.
It should return [value, toggle] where toggle flips the value.
Use it to create a show/hide feature.`,
    starterCode: `import { useState } from 'react';

function useToggle(initialValue = false) {
  // Implement the hook
}

function ShowHide() {
  const [isVisible, toggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Now you see me!</p>}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}

function ShowHide() {
  const [isVisible, toggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Now you see me!</p>}
    </div>
  );
}`,
    hints: ['Use useState inside useToggle', 'toggle should negate the current value', 'Return an array with value and toggle function'],
    validationPrompt: 'Check if useToggle uses useState and returns array with toggle function',
  },
  {
    id: 'hooks-ex-2',
    lessonId: 'hooks-intro',
    moduleId: 'custom-hooks',
    title: 'useInput Hook',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Create a useInput hook for form inputs',
    instructions: `Create a useInput hook that manages input state.
It should return { value, onChange, reset }.
reset should clear the input back to the initial value.`,
    starterCode: `import { useState } from 'react';

function useInput(initialValue = '') {
  // Implement the hook
}

function NameForm() {
  const nameInput = useInput('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Hello, \${nameInput.value}!\`);
    nameInput.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nameInput.value}
        onChange={nameInput.onChange}
        placeholder="Enter name"
      />
      <button type="submit">Submit</button>
    </form>
  );
}`,
    solution: `import { useState } from 'react';

function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => setValue(e.target.value);
  const reset = () => setValue(initialValue);

  return { value, onChange, reset };
}

function NameForm() {
  const nameInput = useInput('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Hello, \${nameInput.value}!\`);
    nameInput.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nameInput.value}
        onChange={nameInput.onChange}
        placeholder="Enter name"
      />
      <button type="submit">Submit</button>
    </form>
  );
}`,
    hints: ['useState to store the value', 'onChange should update with e.target.value', 'reset sets value back to initialValue'],
    validationPrompt: 'Check if useInput returns object with value, onChange and reset',
  },
  {
    id: 'hooks-ex-3',
    lessonId: 'hooks-patterns',
    moduleId: 'custom-hooks',
    title: 'usePrevious Hook',
    difficulty: 'hard',
    xpReward: 40,
    description: 'Create a hook to track previous values',
    instructions: `Create a usePrevious hook that remembers the previous value.
Use useRef and useEffect to track changes.
Show both current and previous count values.`,
    starterCode: `import { useState, useRef, useEffect } from 'react';

function usePrevious(value) {
  // Use useRef to store the previous value
  // Use useEffect to update it after render
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,
    solution: `import { useState, useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,
    hints: ['Create a ref with useRef()', 'useEffect runs after render to save current value', 'Return ref.current which has the old value'],
    validationPrompt: 'Check if usePrevious uses useRef and useEffect to track previous value',
  },

  // Performance Exercises
  {
    id: 'perf-ex-1',
    lessonId: 'perf-memo',
    moduleId: 'performance',
    title: 'Memoize Component',
    difficulty: 'medium',
    xpReward: 30,
    description: 'Use React.memo to prevent unnecessary re-renders',
    instructions: `The ExpensiveList re-renders whenever count changes.
Wrap it with React.memo to prevent this.
Add console.log to verify it only renders when items change.`,
    starterCode: `import { useState, memo } from 'react';

function ExpensiveList({ items }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const items = ['A', 'B', 'C'];

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveList items={items} />
    </div>
  );
}`,
    solution: `import { useState, memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const items = ['A', 'B', 'C'];

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveList items={items} />
    </div>
  );
}`,
    hints: ['Wrap the component function with memo()', 'memo compares props and skips render if unchanged', 'const Component = memo(function...)'],
    validationPrompt: 'Check if ExpensiveList is wrapped with memo',
  },
  {
    id: 'perf-ex-2',
    lessonId: 'perf-usememo',
    moduleId: 'performance',
    title: 'Use useMemo',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Memoize an expensive calculation',
    instructions: `The filteredItems calculation runs on every render.
Use useMemo to memoize it so it only recalculates when items or filter changes.`,
    starterCode: `import { useState, useMemo } from 'react';

function FilteredList() {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  // This runs on EVERY render - expensive!
  console.log('Filtering items...');
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ul>
        {filteredItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
    solution: `import { useState, useMemo } from 'react';

function FilteredList() {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item =>
      item.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ul>
        {filteredItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
    hints: ['Wrap the filter logic in useMemo()', 'Pass a dependency array with items and filter', 'Return the filtered result from useMemo'],
    validationPrompt: 'Check if filteredItems uses useMemo with proper dependencies',
  },
  {
    id: 'perf-ex-3',
    lessonId: 'perf-usememo',
    moduleId: 'performance',
    title: 'Use useCallback',
    difficulty: 'hard',
    xpReward: 40,
    description: 'Memoize a callback function',
    instructions: `The Button component re-renders because handleClick is recreated each time.
Use useCallback to memoize handleClick.
Button is already wrapped with memo.`,
    starterCode: `import { useState, useCallback, memo } from 'react';

const Button = memo(function Button({ onClick, children }) {
  console.log('Button rendered:', children);
  return <button onClick={onClick}>{children}</button>;
});

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // This is recreated every render!
  const handleClick = () => {
    setCount(c => c + 1);
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Count: {count}</p>
      <Button onClick={handleClick}>Increment</Button>
    </div>
  );
}`,
    solution: `import { useState, useCallback, memo } from 'react';

const Button = memo(function Button({ onClick, children }) {
  console.log('Button rendered:', children);
  return <button onClick={onClick}>{children}</button>;
});

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Count: {count}</p>
      <Button onClick={handleClick}>Increment</Button>
    </div>
  );
}`,
    hints: ['Wrap handleClick with useCallback', 'Pass an empty dependency array since it uses setCount updater', 'useCallback prevents function recreation'],
    validationPrompt: 'Check if handleClick is wrapped with useCallback',
  },

  // React Router Exercises
  {
    id: 'router-ex-1',
    lessonId: 'router-basics',
    moduleId: 'react-router',
    title: 'Basic Routes',
    difficulty: 'easy',
    xpReward: 25,
    description: 'Set up basic routing',
    instructions: `Complete the App component with routing.
Add routes for Home (/) and About (/about).
Add navigation links to both pages.`,
    starterCode: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        {/* Add Links here */}
      </nav>
      <Routes>
        {/* Add Routes here */}
      </Routes>
    </BrowserRouter>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    hints: ['Use Link component for navigation', 'Use Route with path and element props', 'Wrap Routes around all Route components'],
    validationPrompt: 'Check if Routes contains two Route components with correct paths',
  },
  {
    id: 'router-ex-2',
    lessonId: 'router-params',
    moduleId: 'react-router',
    title: 'Dynamic Routes',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Use route parameters',
    instructions: `Add a dynamic route for user profiles: /user/:userId
Create a UserProfile component that displays the userId from the URL.
Add links to view User 1 and User 2.`,
    starterCode: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Users</h1>
      {/* Add links to /user/1 and /user/2 */}
    </div>
  );
}

function UserProfile() {
  // Get userId from URL params

  return <h1>User Profile: {/* show userId */}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add user profile route */}
      </Routes>
    </BrowserRouter>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Users</h1>
      <Link to="/user/1">User 1</Link>
      <Link to="/user/2">User 2</Link>
    </div>
  );
}

function UserProfile() {
  const { userId } = useParams();

  return <h1>User Profile: {userId}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    hints: ['Use :userId in the route path', 'useParams() returns an object with route parameters', 'Destructure userId from useParams()'],
    validationPrompt: 'Check if route has :userId param and UserProfile uses useParams',
  },
  {
    id: 'router-ex-3',
    lessonId: 'router-navigation',
    moduleId: 'react-router',
    title: 'Programmatic Navigation',
    difficulty: 'medium',
    xpReward: 35,
    description: 'Navigate after form submission',
    instructions: `Complete the LoginForm to navigate to /dashboard after clicking login.
Use the useNavigate hook.
Also add a button on Dashboard to go back.`,
    starterCode: `import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function LoginForm() {
  // Get navigate function

  const handleLogin = () => {
    // Navigate to /dashboard
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function Dashboard() {
  // Get navigate function

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add button to go back */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    hints: ['Call useNavigate() to get navigate function', 'navigate(\'/path\') goes to that path', 'navigate(-1) goes back one step'],
    validationPrompt: 'Check if useNavigate is used for navigation to dashboard',
  },
];

export function getModule(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id);
}

export function getLessonsForModule(moduleId: string): Lesson[] {
  return lessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.order - b.order);
}

export function getExercisesForLesson(lessonId: string): Exercise[] {
  return exercises.filter(e => e.lessonId === lessonId);
}

export function getExercisesForModule(moduleId: string): Exercise[] {
  return exercises.filter(e => e.moduleId === moduleId);
}

export function getExercise(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}
