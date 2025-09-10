import React from "react"

export function TypographyExample() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Typography Plugin Example</h1>

      {/* Basic prose styling */}
      <article className="prose prose-lg max-w-none">
        <h2>Welcome to the Typography Plugin</h2>
        <p className="lead">
          This is a lead paragraph that demonstrates the beautiful typography styles provided by the
          @tailwindcss/typography plugin.
        </p>

        <h3>Rich Text Content</h3>
        <p>
          The typography plugin automatically styles your content with sensible defaults. You can write content with{" "}
          <strong>bold text</strong>, <em>italic text</em>, and even <a href="#">links that look great</a> out of the
          box.
        </p>

        <h4>Features Include:</h4>
        <ul>
          <li>Beautifully styled headings</li>
          <li>Properly spaced paragraphs</li>
          <li>Lists with nice bullets and numbering</li>
          <li>Blockquotes for emphasis</li>
          <li>Code blocks with syntax highlighting</li>
        </ul>

        <blockquote>
          "The @tailwindcss/typography plugin is a must-have for any project that includes long-form content like blog
          posts or documentation."
        </blockquote>

        <h3>Code Examples</h3>
        <p>
          You can include inline code like <code>npm install @tailwindcss/typography</code>
          or code blocks:
        </p>

        <pre>
          <code className="language-javascript">{`// Example JavaScript code
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}</code>
        </pre>

        <h3>Ordered Lists</h3>
        <ol>
          <li>First item in the ordered list</li>
          <li>Second item with more content</li>
          <li>
            Third item that wraps to multiple lines when the content is long enough to demonstrate proper line spacing
          </li>
        </ol>

        <h3>Tables</h3>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Typography</td>
              <td>Beautiful text styling</td>
              <td>✅ Active</td>
            </tr>
            <tr>
              <td>Dark Mode</td>
              <td>Automatic dark mode support</td>
              <td>✅ Ready</td>
            </tr>
            <tr>
              <td>Responsive</td>
              <td>Mobile-friendly design</td>
              <td>✅ Built-in</td>
            </tr>
          </tbody>
        </table>
      </article>

      {/* Dark mode example */}
      <div className="mt-12 rounded-lg bg-gray-900 p-8">
        <article className="prose prose-invert prose-lg max-w-none">
          <h2>Dark Mode Typography</h2>
          <p>
            The typography plugin also supports dark mode with the
            <code>prose-invert</code> class. All your content automatically adapts to dark backgrounds with appropriate
            color schemes.
          </p>
          <ul>
            <li>Light text on dark background</li>
            <li>Adjusted link colors for visibility</li>
            <li>Proper contrast for readability</li>
          </ul>
        </article>
      </div>

      {/* Size variants */}
      <div className="mt-12 space-y-8">
        <h2 className="mb-4 text-2xl font-bold">Size Variants</h2>

        <div className="prose prose-sm">
          <h3>Small Typography (prose-sm)</h3>
          <p>This uses smaller font sizes, perfect for compact interfaces or secondary content.</p>
        </div>

        <div className="prose">
          <h3>Default Typography (prose)</h3>
          <p>The default size works great for most content and maintains excellent readability.</p>
        </div>

        <div className="prose prose-lg">
          <h3>Large Typography (prose-lg)</h3>
          <p>Larger text for when you want to make a statement or improve readability on larger screens.</p>
        </div>

        <div className="prose prose-xl">
          <h3>Extra Large Typography (prose-xl)</h3>
          <p>The largest preset size, ideal for hero sections or featured content.</p>
        </div>

        <div className="prose prose-2xl">
          <h3>2XL Typography (prose-2xl)</h3>
          <p>Maximum impact with the largest typography size available.</p>
        </div>
      </div>

      {/* Custom styling */}
      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Custom Prose Styling</h2>
        <article className="prose prose-lg prose-a:text-terminal-cyan prose-strong:text-terminal-text max-w-none">
          <p>
            You can customize prose elements using Tailwind modifiers. For example, this paragraph has{" "}
            <a href="#">custom colored links</a>
            and <strong>custom colored bold text</strong> using your terminal theme colors.
          </p>
        </article>
      </div>
    </div>
  )
}
