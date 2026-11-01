import onThisPage from './onThisPage.js';

export const sections = [
  { id: 'start', label: 'Quick start' },
  { id: 'css', label: 'CSS' },
  { id: 'js', label: 'JS' },
  { id: 'cdn', label: 'jsDelivr CDN' },
  { id: 'ai', label: 'AI-ready' },
  { id: 'ai-prompt', label: 'AI prompt' },
  { id: 'see-it-work', label: 'See it work' },
];

const introductionHTML = `
<div class="content-between align-center">
    <h1>Get started with GALS</h1>
    <a class="btn" href="https://github.com/IvanIvanson/gals" target="_blank" rel="noopener">View on GitHub</a>
</div>

<div><p><strong>GALS</strong> (Grid Application Layout Systems) is a powerful, feature-packed frontend toolkit. Build anything—from prototype to production—in minutes.</p>
<p>Every class is also published as machine-readable reference — <a href="./llms.txt">llms.txt</a> and <a href="./llms/gals-classes.json">gals-classes.json</a> — so ChatGPT, Claude or Copilot generate real GALS markup instead of inventing Bootstrap classes. <a href="#ai">How it works ↓</a></p>
</div>

<h3>See it work</h3>
<p>Everything below is plain HTML with GALS classes — no React, no build step. Click to try.</p>

<div class="demo">
    <div class="demo-body">
        <div class="accordion-group">
            <details class="accordion" open>
                <summary>What does a column class look like?</summary>
                <div class="accordion-body"><code>class="pt-6 pt-s12"</code> — 50% on desktop, full width below 770px. GALS has no <code>.col-*</code> classes.</div>
            </details>
            <details class="accordion">
                <summary>How many classes are there?</summary>
                <div class="accordion-body">186 classes and 8 design tokens, all documented in <a href="./llms/gals-classes.json">gals-classes.json</a>.</div>
            </details>
            <details class="accordion">
                <summary>Do I need a build step?</summary>
                <div class="accordion-body">No. One <code>&lt;link&gt;</code> and one <code>&lt;script&gt;</code> tag and you are building.</div>
            </details>
        </div>
    </div>
    <p class="demo-caption">The accordion above is <code>details.accordion</code> — three lines of HTML, no JavaScript.</p>
</div>

${onThisPage(sections)}
<div class="quick-start">
     <h3 id="start">Quick start</h3>

    <p>Get started by including GALS’s production-ready CSS and JavaScript  without the need for any build steps.
    See it in practice with this <a href="https://codepen.io/IvanIvan/pen/LYVMxGp" target="_blank" rel="noopener">GALS CodePen demo</a>.</p>
    <p>1. <strong>Create a new <span style="color:rgb(212, 38, 38);font-size:16px;">index.html</span> </strong> <strong>file in your project root</strong>. Include the
    <code style="color:rgb(212, 38, 38);">&#60;meta name="viewport"&#62;</code> tag as well for proper responsive behavior in mobile devices. Place the<span style="color:rgb(212, 38, 38);font-size:18px;"> &#60;link&#62; </span>  tag in the <span style="color:rgb(212, 38, 38);font-size:18px;">&#60;head&#62; </span>  for our CSS, and the <span style="color:rgb(212, 38, 38);font-size:18px;">&#60;script&#62; </span>  tag for our JavaScript bundle before the closing <span style="color:rgb(212, 38, 38);font-size:18px;">&#60;/body&#62;</span>.</p>
 
 <!-- copyblock -->   
    
     <div class="copy-block copy-block1">
        <code> <pre>
&#60;<span style="color:rgb(212, 38, 38);">!doctype html</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">html</span><span style="color:rgb(87, 68,225);"> lang="en"</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">head</span>&#62;
  &#60;<span style="color:rgb(212, 38, 38);">meta </span><span style="color:rgb(87, 68,225);">charset="utf-8"</span>&#62;
  &#60;<span style="color:rgb(212, 38, 38);">meta </span><span style="color:rgb(87, 68,225);">name="viewport" content="width=device-width,initial-scale=1"</span>&#62;
  &#60;<span style="color:rgb(212, 38, 38);">title</span>&#62;Galsdemo&#60;/<span style="color:rgb(212, 38, 38);">title</span>&#62;
  &#60;<span style="color:rgb(212, 38, 38);">link </span><span style="color:rgb(87, 68,225);">rel="stylesheet" </span><span style="color:rgb(87, 68,225);">href="./gals/gals.css"</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">/head</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">body</span>&#62;
  &#60;<span style="color:rgb(212, 38, 38);">h1</span>&#62;Hello, world!&#60;/<span style="color:rgb(212, 38, 38);">h1</span>&#62;
  &#60;<span style="color:rgb(212, 38, 38);">script </span><span style="color:rgb(87, 68, 225);">src="./gals/gals.js"</span>&#62;&#60;<span style="color:rgb(212, 38, 38);">/script</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">/body</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">/html</span>&#62;</pre>
    </code>
        

        <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy code to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard"
            viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
       
    </div>
    <!--  -->
 <p id="css">2. <strong>CSS</strong>.</p>
                            <p>Copy-paste the stylesheet
                            <span style="color:rgb(212, 38, 38);font-size:18px;"><code>&#60;link&#62;</code></span> into your <span style="color:rgb(212, 38, 38);font-size:18px;"><code>&#60;head&#62;</code> 
                            </span> before all other stylesheets to load our CSS. To ensure that the GALS styles do not interrupt the styles that you will define.
                        </p>
<div class="copy-block copy-block2">
    <code><pre>&#60;<span style="color:rgb(212, 38, 38);">link </span><span style="color:rgb(87, 68, 225);">rel="stylesheet" </span><span style="color:rgb(87, 68, 225);">href="./gals/gals.css"</span>&#62;</pre>
    </code>

    <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy code to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
</div>
<!--  -->

 <!--  -->
 <p id="js">3. <strong>JS</strong>.</p>
                            <p>Place one of the following
                            <span style="color:rgb(212, 38, 38);font-size:18px;"><code >&#60;script&#62;</code></span>near the end of your pages, right before the closing<span style="color:rgb(212, 38, 38);font-size:18px;"><code>&#60;body&#62;</code> 
                            </span> tag, to enable them.
                        </p>
<div class="copy-block copy-block3">
    <code><pre>&#60;<span style="color:rgb(212, 38, 38);">script </span><span style="color:rgb(87, 68, 225);">src="./gals/gals.js"</span>&#62;&#60;<span style="color:rgb(212, 38, 38);">/script</span>&#62;</pre>
    </code>

    <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy code to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
</div>
<!--  -->
<h3 id="cdn">jsDelivr CDN</h3>
<p>You can load GALS directly from jsDelivr — no download, no build step.
Just point to the <code>cdn/</code> folder in the repository.</p>

<div class="copy-block copy-block-cdn">
    <code><pre>&#60;<span style="color:rgb(212, 38, 38);">link </span><span style="color:rgb(87, 68, 225);">rel="stylesheet" </span><span style="color:rgb(87, 68, 225);">href="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@v1.2/gals-main/cdn/gals.min.css"</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">script </span><span style="color:rgb(87, 68, 225);">src="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@v1.2/gals-main/cdn/gals.min.js"</span>&#62;&#60;<span style="color:rgb(212, 38, 38);">/script</span>&#62;</pre>
    </code>

    <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy code to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
        <path
            d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
        <path
            d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
    </svg></button>
</div>

<p>Both links are <strong>pinned to the <code>v1.2</code> tag</strong>, which jsDelivr caches forever — the file you ship today is the file you ship next year. To move to a newer release, change the tag in both URLs. <code>@main</code> also works and always serves the latest commit, but it can change under you between deploys.</p>

<p>
    <a href="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@main/gals-main/cdn/" target="_blank" rel="noopener">Browse CDN files on jsDelivr <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="vertical-align:-2px"><path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg></a>
</p>
<!--  -->

<h3 id="ai">Built for AI</h3>
<p>GALS is written to be read by a model, not only by a person. Three machine-readable files ship with the site, and each one is checked by the test suite, so a model is never handed a class that does not exist.</p>

<ul>
    <li><strong><a href="./llms.txt">llms.txt</a></strong> — the whole framework as plain text, small enough for a context window.</li>
    <li><strong><a href="./llms/gals-classes.json">llms/gals-classes.json</a></strong> — 186 classes and 8 design tokens as data: selector, what it does, parent, breakpoints, live example.</li>
    <li><strong><a href="./AI_PROMPT_TEMPLATE.md">AI_PROMPT_TEMPLATE.md</a></strong> — the same prompt shown below, as a file.</li>
</ul>

<p>The JSON is generated from <code>gals.css</code> itself and the test suite fails if the two drift apart. It also carries a <code>doesNotExist</code> list (<code>.row</code>, <code>.col</code>, <code>mt-*</code>, <code>mb-*</code>) — the Bootstrap and Tailwind habits a model falls back to by default — so a generated answer can be checked against real mistakes instead of plausible ones.</p>

<h3 id="ai-prompt">Ask AI the right way</h3>
<p>Copy this prompt template, paste it into ChatGPT, Claude, GitHub Copilot or Cursor, and replace the text in <code>[SQUARE BRACKETS]</code> with your task.</p>

<div class="copy-block copy-block4">
    <code><pre>Act as an experienced frontend developer specializing in the GALS framework.

Task:
Create a [COMPONENT / PAGE / LAYOUT] that does the following: [DESCRIBE THE FUNCTIONALITY, e.g. "a responsive product card with an image, title, price and a 'Buy' button"].

Strict constraints and rules:
1. Framework: use ONLY GALS classes. Do not use Bootstrap, Tailwind or other libraries.
2. Grid: the structure is .container &gt; .container-block with a pt-N column class. GALS has NO .row and NO .col classes, and pt-N classes only apply inside .container.
3. Columns: pt-1 .. pt-12 set width in twelfths (pt-6 = 50%). pt-N is a COLUMN width, not padding. GALS has no spacing utilities except .padding-lg.
4. Responsiveness: override a column per breakpoint with pt-{bp}N, where bp is xl (1440px+), l (max 1439.98px), m (max 1025px), s (max 770px), xs (max 425px), xxs (max 375px). Example: class="pt-6 pt-s12" is 50% on desktop and full width from 770px down. Hide on a breakpoint with pt-{bp}-d_n.
5. Styles: for custom styles reuse the GALS tokens: var(--accent), var(--ink), var(--paper), var(--ok), var(--warn), var(--err), var(--line), var(--gridmultiplyConst).
6. Components: header, table, btn, alert, card, accordion, carousel, dropdown, modal, menu, tabs, pagination, popover, progress, loader, skeleton, icon, media, input, select, range, checkbox, radio, switch. If a class is not in this list, do not invent it — write plain CSS instead.
7. Output: provide ONLY valid HTML. Include &lt;link rel="stylesheet" href="gals/gals.css"&gt; in the &lt;head&gt; and &lt;script src="gals/gals.js" defer&gt;&lt;/script&gt; before &lt;/body&gt;. Make sure all tags are closed and accessibility (ARIA) attributes are used.

Context:
[OPTIONAL: add specific requirements here, e.g. "Use .alert-ok for the success message and .btn-primary for the main action"].</pre>
    </code>

    <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy code to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
</div>
</div>
`;

export default { sections, html: introductionHTML };
