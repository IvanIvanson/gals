import { page, planned, codeBlock, demo, table, notice } from './page.js';

/** Утилиты: то, что реально есть в gals.css, и то, чего в нём нет. */

const HELPERS = [
  ['<code>.space-between</code> / <code>-around</code> / <code>-center</code>', 'justify-content on a <code>.container</code>'],
  ['<code>.align-center</code> / <code>-flexEnd</code> / <code>-flexStart</code>', 'align-items on a <code>.container</code>'],
  ['<code>.alignSelf-center</code> / <code>-start</code> / <code>-baseline</code> / <code>-end</code>', 'align-self on one column'],
  ['<code>.content-between</code> / <code>-center</code> / <code>-around</code>', 'a flex row that is not a grid container'],
  ['<code>.container-flex</code>', 'bare <code>display: flex</code>'],
  ['<code>.container-fluid</code> / <code>.flex-grow1</code> / <code>.flex-grow2</code>', 'flex-grow 1 or 2'],
  ['<code>.text-center</code>', 'text-align'],
  ['<code>.padding-lg</code>', '80px of left and right padding'],
  ['<code>.border</code> / <code>.borderRed</code> / <code>-Green</code> / <code>-Blue</code>', 'outline, for debugging a layout'],
  ['<code>.pt-xl-d_n</code> … <code>.pt-xxs-d_n</code>', 'display: none inside one breakpoint'],
];

const colors = page({
  title: 'Colors collection',
  lead:
    'Eight tokens in :root — the brand colour, a text/ground pair, three feedback states and a hairline. '
    + 'Every component in the framework reads them, so recolouring GALS is one block.',
  blocks: [
    {
      id: 'tokens',
      label: 'The tokens',
      html: table(
        ['Token', 'Default', 'Role'],
        [
          ['<code>--accent</code>', '<code>#8512d1</code>', 'primary action, brand mark, focus ring'],
          ['<code>--ink</code>', '<code>#222222</code>', 'text'],
          ['<code>--paper</code>', '<code>#ffffff</code>', 'ground'],
          ['<code>--ok</code> / <code>--warn</code> / <code>--err</code>', 'green / amber / red', 'feedback states'],
          ['<code>--line</code>', '<code>#cecece</code>', 'hairlines and borders'],
        ],
      ),
    },
    {
      id: 'override',
      label: 'Overriding them',
      html: `
<p>Custom properties inherit — override on <code>:root</code> for the whole page or on any subtree
for one section. The components follow, because none of them names a colour twice.</p>
${codeBlock(
  `:root {
  --accent: #e3e027;   /* the documentation site’s yellow */
  --ink: #000;
  --paper: #fff;
}`,
)}
${demo(
  `<div style="--accent:#2a7fd4;--ok:#2a7d4a;padding:10px">
    <p class="alert alert-info">alert-info follows --accent, not a literal.</p>
    <p class="alert alert-ok">alert-ok follows --ok.</p>
    <button class="btn btn-primary" type="button">Primary button</button>
  </div>`,
  'One override on the wrapper retunes everything inside it.',
)}`,
    },
    {
      id: 'contrast',
      label: 'Contrast is the contract',
      html: `
${notice(
  'Contrast is the contract',
  'Body text must reach 4.5:1 against its background, large text 3:1. On the yellow above, black '
  + 'passes and white fails — which is why the label is dark. The tokens give you names; the '
  + 'contrast you check yourself.',
)}`,
    },
  ],
});

const classes = page({
  title: 'Classes',
  lead:
    'The complete set of helpers in gals.css. Everything the framework adds beyond the grid is a '
    + 'one-property class, listed here in full.',
  blocks: [
    {
      id: 'list',
      label: 'Every helper',
      html: table(['Class', 'What it sets'], HELPERS),
    },
    {
      id: 'hiding',
      label: 'Hiding a column',
      html: `
<p>The <code>-d_n</code> family is the only responsive utility besides the widths, and it is scoped '
to a single breakpoint like the rest. Hiding a column is cheaper than rebuilding it.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-8">always visible</div>
  <div class="container-block pt-4 pt-s-d_n">gone below 770px</div>
</div>`,
)}
${demo(
  `<div class="container">
    <div class="container-block pt-8 pt-xs12"><div class="demo-cell">pt-8</div></div>
    <div class="container-block pt-4 pt-s-d_n"><div class="demo-cell">pt-s-d_n</div></div>
</div>`,
  'Narrow the window past 770px and the second cell disappears.',
)}</p>`,
    },
    {
      id: 'debug',
      label: 'Debugging a row',
      html: `
<p>The <code>.border*</code> classes use <code>outline</code>, not <code>border</code>, so adding one '
cannot change a width and make the bug you are chasing worse.</p>
${demo(
  `<div class="container borderRed">
    <div class="container-block pt-4 borderGreen"><div class="demo-cell">pt-4</div></div>
    <div class="container-block pt-4 borderGreen"><div class="demo-cell">pt-4</div></div>
</div>`,
  'The red outline is the container padding, the green ones are the blocks.',
)}</p>`,
    },
    {
      id: 'limits',
      label: 'Where to stop',
      html: `
<p>Three or more helpers doing one job is a component — give it a name. And never override a component '
with a utility; fix the component or add a modifier to it.</p>
${notice(
  'Not shipped',
  'There is no spacing scale, no <code>.d-flex</code>, no <code>.visually-hidden</code>. The screen '
  + 'reader helper in use on this site comes from the page stylesheet, not from the framework. The '
  + 'colour tokens and the focus ring do ship — see <em>Colors collection</em> and <em>Controls '
  + 'visible</em>.',
)}</p>`,
    },
  ],
});

const controlsAudio = page({
  title: 'Controls Audio',
  lead:
    'An audio player: the native element is the player, the framework makes it behave like a column — full width, no overflow.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p><code>.audio</code> is <code>display: block; width: 100%</code> — that is the whole class. The
browser’s player controls stay native.</p>
${codeBlock(
  `<audio class="audio" controls preload="metadata" src="track.mp3">
  <a href="track.mp3">Download the track</a>
</audio>`,
)}
${demo(
  `<audio class="audio" controls preload="none">
    <source src="about:blank" type="audio/mpeg">
    <a href="#usage">Download the track</a>
  </audio>`,
  'The chrome of your browser, not a screenshot: native controls, column width.',
)}`,
    },
    {
      id: 'notes',
      label: 'Notes',
      html: `
<ul>
  <li>Never autoplay. Autoplay with sound is blocked outright in Chrome and Firefox, so design for a click.</li>
  <li>Put a transcript or show notes next to the player, not behind a toggle.</li>
  <li>A link to the file is the fallback that makes the player optional.</li>
</ul>`,
    },
  ],
});

const controlsVideo = page({
  title: 'Controls Video',
  lead:
    'Responsive video with captions and a poster: <code>.media</code> holds a 16/9 box, the rest is native elements.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p><code>.media</code> gives the video an intrinsic <code>aspect-ratio</code> (16/9), so the box is
right before any pixel loads — the job the old padding-hack trick used to do, in one line.
<code>.media-4-3</code> and <code>.media-1-1</code> switch the ratio.</p>
${codeBlock(
  `<video class="media" controls preload="none" poster="cover.jpg">
  <source src="clip.webm" type="video/webm">
  <source src="clip.mp4" type="video/mp4">
  <track kind="captions" src="clip.en.vtt" srclang="en" label="English" default>
  <a href="clip.mp4">Download the clip</a>
</video>`,
)}
${demo(
  `<video class="media" controls preload="none" poster="../image/gridlsicon.png">
    <a href="#usage">Download the clip</a>
  </video>
  <img class="media media-1-1" style="max-width:10em;margin-top:1em"
       src="../image/gridlsicon.png" alt="The same class on an image">`,
  '.media on a video and on an image — the box is the class, not the element.',
)}`,
    },
    {
      id: 'notes',
      label: 'Notes',
      html: `
<ul>
  <li><code>preload="none"</code> plus a poster: a video that downloads on page load is the most expensive byte on most pages.</li>
  <li>Captions are a <code>&lt;track&gt;</code>, not burned-in text you cannot translate or turn off.</li>
  <li>An embed from a hosting service is a tracker with a player attached.</li>
</ul>`,
    },
  ],
});

const controlsVisible = page({
  title: 'Controls visible',
  lead:
    'Whether the thing a user is operating can actually be seen and reached. The framework now ships the focus ring; the rest are the rules your project must keep.',
  blocks: [
    {
      id: 'focus',
      label: 'Focus',
      html: `
<p>The framework sets one global rule: <code>:focus-visible</code> shows the accent ring for
keyboard users and hides it for mouse clicks. That removes the only reason designers used to strip
outlines.</p>
${codeBlock(
  `/* gals.css — ships with the framework */
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* never */
*:focus { outline: none; }`,
)}
${demo(
  `<button class="btn" type="button">Tab to me</button>
  <a class="btn" href="#focus" style="margin-left:.5em">and to me</a>`,
  'Both take the ring on keyboard focus and drop it on click.',
)}`,
    },
    {
      id: 'targets',
      label: 'Targets and scroll',
      html: `
${table(
  ['Rule', 'Number'],
  [
    ['Minimum target size (WCAG 2.2)', '24×24 CSS px'],
    ['Comfortable on touch', '44×44 CSS px'],
    ['<code>scroll-padding-top</code>', 'height of the sticky header'],
    ['Contrast, body text', '4.5:1'],
  ],
)}`,
    },
    {
      id: 'motion',
      label: 'Motion',
      html: `
${codeBlock(
  `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}`,
)}
<p>The framework ships two animations — the spinner and the skeleton shimmer — and opts the shimmer
out itself. The spinner keeps running under reduce, because it is information; add the block above
in your own layer for everything else.</p>`,
    },
  ],
});

const canvasForProjects = page({
  title: 'Canvas for your projects',
  lead:
    'A canvas is a bitmap you draw on. Right tool for many pixels, wrong tool for anything a user reads. '
    + 'The framework has no canvas API — this page is the guidance that keeps you out of trouble.',
  blocks: [
    {
      id: 'when',
      label: 'When to use it',
      html: table(
        ['Need', 'Use'],
        [
          ['a chart with fifty points', 'canvas'],
          ['a chart with a selectable legend', 'SVG or plain HTML'],
          ['text a user can read, select or translate', 'HTML — never canvas'],
        ],
      ),
    },
    {
      id: 'dpr',
      label: 'Crisp, not blurry',
      html: `
<p>The one thing that separates a crisp chart from a blurry one is scaling by device pixel ratio.
Set the attribute size, then draw in CSS units.</p>
${codeBlock(
  `const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);   // now draw in CSS pixels`,
)}`,
    },
    {
      id: 'a11y',
      label: 'Accessibility',
      html: `
<ul>
  <li>A canvas is opaque to assistive technology: <code>role="img"</code> and an <code>aria-label</code> that states the trend, with the numbers in a table nearby.</li>
  <li>Redraw on resize, not on scroll, and stop the loop when the canvas leaves the viewport.</li>
</ul>`,
    },
  ],
});

export default {
  'colors-collection': colors,
  classes,
  'controls-audio': controlsAudio,
  'controls-video': controlsVideo,
  'controls-visible': controlsVisible,
  'canvas-for-your-projects': canvasForProjects,
};
