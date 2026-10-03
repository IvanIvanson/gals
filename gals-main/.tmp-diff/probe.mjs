import { JSDOM } from 'jsdom';

const dom = new JSDOM('<p>', { url: 'https://example.test/' });
console.log('isSecureContext:', dom.window.isSecureContext);
console.log('clipboard before:', dom.window.navigator.clipboard);
try {
  Object.defineProperty(dom.window.navigator, 'clipboard', {
    value: { writeText: (t) => console.log('WROTE', t.length) },
    configurable: true,
  });
  console.log('clipboard after:', typeof dom.window.navigator.clipboard.writeText);
} catch (e) {
  console.log('defineProperty failed:', e.message);
}
