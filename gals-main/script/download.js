import onThisPage from './onThisPage.js';

export const sections = [
  { id: 'get', label: 'Get the source' },
  { id: 'archive', label: "What's inside" },
  { id: 'usage', label: 'Use it' },
];

const downloadHTML = `
<div class="content-between align-center">
    <h1>Download GALS</h1>
    <a class="btn btn-primary" href="./download/grid.zip" download>Download grid.zip</a>
</div>

<div><p>GALS ships as two framework files and nothing else. No build step, no dependencies, no configuration.</p>
</div>
${onThisPage(sections)}
<div class="quick-start">
    <h3 id="get">Get the source</h3>
    <p>Grab the latest archive with the grid demo, or take the framework files straight from the
    <code>gals/</code> folder of the repository.</p>

    <div class="copy-block">
        <code><pre>
gals/
    gals.css    <span style="color:rgb(87, 68,225);">/* the grid and helpers */</span>
    gals.js     <span style="color:rgb(87, 68,225);">/* responsive images + mobile menu */</span>
        </pre></code>

        <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy code to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
    </div>

    <h3 id="archive">What's inside</h3>
    <p>The archive contains the standalone grid playground: the same twelve column grid with the
    responsive prefixes <code>pt-xl</code>, <code>pt-l</code>, <code>pt-m</code>, <code>pt-s</code>,
    <code>pt-xs</code> and <code>pt-xxs</code>, plus a small script that keeps fluid images sized to
    their container.</p>

    <h3 id="usage">Use it</h3>
    <p>Drop the stylesheet into the <code>&#60;head&#62;</code> and the script right before the closing
    <code>&#60;/body&#62;</code> tag. Everything else is plain HTML.</p>

    <div class="copy-block">
        <code><pre>
&#60;<span style="color:rgb(212, 38, 38);">link </span><span style="color:rgb(87, 68, 225);">href="./gals/gals.css"</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">script </span><span style="color:rgb(87, 68, 225);">src="./gals/gals.js"</span> <span style="color:rgb(87, 68, 225);">defer</span>&#62;&#60;<span style="color:rgb(212, 38, 38);">/script</span>&#62;
        </pre></code>

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

export default { sections, html: downloadHTML };
