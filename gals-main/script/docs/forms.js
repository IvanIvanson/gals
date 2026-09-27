import { page, codeBlock, demo, table, notice } from './page.js';

/** Формы: реальные классы .field/.input/.select/.checkbox/.radio/.switch/.range. */

const formControls = page({
  title: 'Form controls',
  lead:
    'Text inputs, textareas and the wrapper that stacks a label, a control and a hint. '
    + 'The grid gives a field its column; the framework gives the field its box.',
  blocks: [
    {
      id: 'field',
      label: 'Field',
      html: `
<p><code>.field</code> stacks label, control and hint with a small gap; <code>.field-hint</code> is
small muted text wired with <code>aria-describedby</code>. Put the field in a column and the grid
handles the width.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-6 pt-xs12">
    <div class="field">
      <label for="name">Name</label>
      <input class="input" id="name" name="name" autocomplete="name">
    </div>
  </div>
  <div class="container-block pt-6 pt-xs12">
    <div class="field">
      <label for="email">Email</label>
      <input class="input" id="email" name="email" type="email" autocomplete="email"
             aria-describedby="email-hint">
      <p class="field-hint" id="email-hint">We only use this for the receipt.</p>
    </div>
  </div>
</div>`,
)}
${demo(
  `<div class="container">
    <div class="container-block pt-6 pt-xs12">
      <div class="field">
        <label for="demo-name">Name</label>
        <input class="input" id="demo-name" placeholder="Ada Lovelace">
      </div>
    </div>
    <div class="container-block pt-6 pt-xs12">
      <div class="field">
        <label for="demo-email">Email</label>
        <input class="input" id="demo-email" type="email" placeholder="you@example.com"
               aria-describedby="demo-email-hint">
        <p class="field-hint" id="demo-email-hint">We only use this for the receipt.</p>
      </div>
    </div>
  </div>`,
  'The widths are the grid classes; the box, the focus ring and the hint are the framework.',
)}`,
    },
    {
      id: 'states',
      label: 'States',
      html: `
<p>Three states ship: the focus ring on <code>:focus-visible</code>, <code>[disabled]</code>, and
<code>[aria-invalid="true"]</code> for validation. Set <code>aria-invalid</code> from your
validation script — colour alone is not a state.</p>
${demo(
  `<div class="container">
    <div class="container-block pt-6 pt-xs12">
      <div class="field">
        <label for="demo-city">City</label>
        <input class="input" id="demo-city" value="Kharkiv">
      </div>
    </div>
    <div class="container-block pt-6 pt-xs12">
      <div class="field">
        <label for="demo-code">Postal code</label>
        <input class="input" id="demo-code" value="61…" aria-invalid="true">
        <p class="field-hint">A postal code is five digits.</p>
      </div>
    </div>
    <div class="container-block pt-6 pt-xs12">
      <div class="field">
        <label for="demo-lock">Managed</label>
        <input class="input" id="demo-lock" value="Set by the server" disabled>
      </div>
    </div>
  </div>`,
  'Tab through: the ring appears on keyboard focus and stays off for clicks.',
)}`,
    },
    {
      id: 'sizes',
      label: 'Widths',
      html: `
<p><code>.input-1</code> through <code>.input-12</code> size a control from the same 1/12 scale as
the columns, so a field can sit in a row without a column wrapper. They apply anywhere; the column
classes still apply only inside a <code>.container</code>.</p>
${table(
  ['Class', 'Applies to', 'Effect'],
  [
    ['<code>.input</code>', '<code>input</code>, <code>textarea</code>', 'the base box, font, padding and focus ring'],
    ['<code>.input-6</code>', 'any control', 'width from the same 1/12 scale'],
    ['<code>.field</code>', 'wrapper', 'stacks label, control and hint'],
    ['<code>.field-hint</code>', '<code>p</code>', 'small text wired with <code>aria-describedby</code>'],
    ['<code>.field-group</code>', '<code>fieldset</code>', 'borderless reset, keeps <code>legend</code> as the name'],
  ],
)}`,
    },
  ],
});

const select = page({
  title: 'Select',
  lead:
    'A styled native select: the framework draws the box and the chevron, the browser keeps the picker. '
    + 'The native picker is the feature — it is the only control that behaves correctly on every touch device for free.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
${codeBlock(
  `<label for="size">Size</label>
<select class="select" id="size" name="size">
  <option value="">Choose a size</option>
  <option value="s">Small</option>
  <option value="m">Medium</option>
</select>`,
)}
${demo(
  `<div class="field" style="max-width:20em">
    <label for="demo-size">Size</label>
    <select class="select" id="demo-size">
      <option value="">Choose a size</option>
      <option value="s">Small</option>
      <option value="m">Medium</option>
      <option value="l">Large</option>
    </select>
  </div>`,
)}`,
    },
    {
      id: 'notes',
      label: 'Notes',
      html: `
<p><code>.select</code> carries the box and the chevron — <code>appearance: none</code> plus an
inline SVG background, so no extra file. The width class stays the grid one, so a select sizes
itself like any other column. Keep <code>&lt;option&gt;</code> children — never rebuild a select
from divs, which loses the keyboard and the OS picker together.</p>
${notice(
  'When not to use a select',
  'Under five options, show radios instead: every choice is visible without a click, which is the '
  + 'whole advantage of a short list.',
)}`,
    },
  ],
});

const checkboxRadio = page({
  title: 'Checkbox & Radio',
  lead:
    'Real inputs with a drawn box. The label is the click target, so the hit area is never the 13px '
    + 'square the browser gives you.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p>Keep the input in the DOM and visually hide it — <code>display: none</code> would remove it from
the accessibility tree. The box is a sibling span driven from <code>:checked</code>, and the focus
ring survives on the box because the selector is <code>:focus-visible + .checkbox-box</code>.</p>
${codeBlock(
  `<label class="checkbox">
  <input type="checkbox" name="terms">
  <span class="checkbox-box" aria-hidden="true"></span>
  <span>I agree to the terms</span>
</label>

<label class="radio">
  <input type="radio" name="plan" value="monthly">
  <span class="radio-box" aria-hidden="true"></span>
  <span>Monthly</span>
</label>

<label class="switch">
  <input type="checkbox" name="autoplay" role="switch">
  <span class="switch-box" aria-hidden="true"></span>
  <span>Autoplay</span>
</label>`,
)}
${demo(
  `<div class="container">
    <div class="container-block pt-6 pt-xs12">
      <label class="checkbox">
        <input type="checkbox" checked>
        <span class="checkbox-box" aria-hidden="true"></span>
        <span>I agree to the terms</span>
      </label>
      <label class="checkbox" style="margin-top:.6em">
        <input type="checkbox">
        <span class="checkbox-box" aria-hidden="true"></span>
        <span>Also the newsletter</span>
      </label>
    </div>
    <div class="container-block pt-6 pt-xs12">
      <label class="radio" style="display:block">
        <input type="radio" name="demo-plan" checked>
        <span class="radio-box" aria-hidden="true"></span>
        <span>Monthly</span>
      </label>
      <label class="radio" style="display:block;margin-top:.6em">
        <input type="radio" name="demo-plan">
        <span class="radio-box" aria-hidden="true"></span>
        <span>Yearly</span>
      </label>
    </div>
    <div class="container-block pt-6 pt-xs12">
      <label class="switch">
        <input type="checkbox" role="switch" checked>
        <span class="switch-box" aria-hidden="true"></span>
        <span>Autoplay</span>
      </label>
    </div>
  </div>`,
  'Click the text, not the box: the whole label is the target. Tab to see the ring on the box.',
)}`,
    },
    {
      id: 'notes',
      label: 'Notes',
      html: `
${table(
  ['Class', 'For', 'Notes'],
  [
    ['<code>.checkbox</code>', 'one value per control', 'box drawn from <code>:checked</code>'],
    ['<code>.radio</code>', 'one of a short list', 'same pattern, round box'],
    ['<code>.switch</code>', 'a setting applied at once', 'only if pressing it needs no submit'],
    ['<code>.field-group</code>', 'fieldset reset', 'keeps <code>legend</code> as the accessible name'],
  ],
)}`,
    },
  ],
});

const range = page({
  title: 'Range',
  lead:
    'A slider whose value is always readable, not only positioned. That distinction is the whole page.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p><code>.range</code> makes the track full width and colours it with <code>accent-color</code> —
one property, native thumb, no vendor prefixes. Pair the input with an <code>&lt;output&gt;</code>
and update it on <code>input</code>; this is four lines of script and needs no framework.</p>
${codeBlock(
  `<label for="gap">Gutter <output for="gap" id="gap-out">5</output>px</label>
<input class="range" id="gap" type="range" min="0" max="40" step="1" value="5"
       oninput="gapOut.value = this.value">`,
)}
${demo(
  `<div class="field" style="max-width:24em">
    <label for="demo-range">Gutter <output id="demo-range-out">5</output>px</label>
    <input class="range" id="demo-range" type="range" min="0" max="40" value="5"
           oninput="document.getElementById('demo-range-out').value = this.value">
  </div>`,
)}`,
    },
    {
      id: 'notes',
      label: 'Notes',
      html: `
<ul>
  <li><code>step</code> is mandatory for anything a keyboard user must land on exactly.</li>
  <li><code>input</code> fires continuously — debounce whatever expensive work it triggers.</li>
  <li>The track keeps a 24px hit area even when it looks thinner.</li>
</ul>`,
    },
  ],
});

export default {
  'form-controls': formControls,
  select,
  'checkbox-radio': checkboxRadio,
  range,
};
