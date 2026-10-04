import settings from './settings.js';
import layout from './layout.js';
import content from './content.js';
import forms from './forms.js';
import components from './components.js';
import helpers from './helpers.js';
import features from './features.js';
import about from './about.js';

/**
 * Единый реестр страниц документации.
 *
 * Ключи модулей совпадают со slug-ом текста пункта меню в index.html
 * (см. page.js), поэтому сорок атрибутов data-action в разметке не нужны.
 * Пересечение ключей между модулями считаем ошибкой сборки и падаем громко.
 */
const SOURCES = [settings, layout, content, forms, components, helpers, features, about];

const buildRegistry = () => {
  const registry = {};

  for (const source of SOURCES) {
    for (const [key, page] of Object.entries(source)) {
      if (key in registry) {
        throw new Error(`Duplicate documentation page key: "${key}"`);
      }

      registry[key] = page;
    }
  }

  return registry;
};

export const docPages = buildRegistry();

export default docPages;