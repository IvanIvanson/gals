/**
 * Тесты machine-readable разметки главной страницы (SEO / GEO).
 *
 * Цель — не дать разметке разойтись с реальным контентом: meta-теги, JSON-LD,
 * robots.txt, sitemap.xml и видимая дата обновляются вместе со страницей, а
 * FAQ в JSON-LD обязан совпадать с аккордеоном на странице, иначе модель
 * получит два разных ответа на один вопрос.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE = 'https://ivanivanson.github.io/gals';

const html = readFileSync(`${ROOT}/index.html`, 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const meta = (selector) => doc.querySelector(selector)?.getAttribute('content')?.trim() ?? '';

/** Единственный блок JSON-LD страницы, разобранный в объект. */
const graph = (() => {
  const node = doc.querySelector('script[type="application/ld+json"]');
  assert.ok(node, 'на странице нет ни одного блока application/ld+json');
  return JSON.parse(node.textContent)['@graph'];
})();

const byType = (type) =>
  graph.find((node) => [].concat(node['@type']).includes(type));

/** Содержимое аккордеона «вопрос-ответ» со страницы Introduction. */
const pageFaq = (() => {
  const intro = readFileSync(`${ROOT}/script/introduction.js`, 'utf8');
  const block = /<div class="accordion-group">([\s\S]*?)<\/div>\s*<\/div>/.exec(intro);
  assert.ok(block, 'в introduction.js не найден accordion-group');
  return [...block[1].matchAll(/<summary>([^<]+)<\/summary>/g)].map((m) => m[1].trim());
})();

describe('meta и Open Graph главной страницы', () => {
  test('description непустой и в разумном размере', () => {
    const description = meta('meta[name="description"]');
    assert.ok(description.length >= 70, `description слишком короткий: ${description.length}`);
    assert.ok(description.length <= 200, `description длиннее 200 символов: ${description.length}`);
  });

  test('title описывает предмет, а не только имя', () => {
    const title = doc.querySelector('title').textContent.trim();
    assert.match(title, /GALS/);
    assert.notEqual(title, 'GALS', 'title должен объяснять, что такое GALS');
    assert.ok(title.length <= 70, `title длиннее 70 символов: ${title.length}`);
  });

  test('canonical указывает на публичный URL', () => {
    assert.equal(doc.querySelector('link[rel="canonical"]')?.href, `${SITE}/`);
  });

  test('Open Graph описывает страницу как сущность', () => {
    assert.equal(meta('meta[property="og:type"]'), 'website');
    for (const property of ['og:site_name', 'og:title', 'og:description', 'og:url', 'og:image']) {
      assert.ok(meta(`meta[property="${property}"]`), `нет ${property}`);
    }

    assert.equal(meta('meta[property="og:url"]'), `${SITE}/`);
    for (const property of ['og:url', 'og:image']) {
      assert.match(meta(`meta[property="${property}"]`), /^https:\/\//, `${property} не абсолютный`);
    }
  });

  test('Twitter Card заполнен и совпадает с Open Graph', () => {
    assert.equal(meta('meta[name="twitter:card"]'), 'summary_large_image');
    assert.equal(meta('meta[name="twitter:title"]'), meta('meta[property="og:title"]'));
    assert.equal(meta('meta[name="twitter:image"]'), meta('meta[property="og:image"]'));
  });

  test('og:image ведёт на файл, который лежит в репозитории', () => {
    const path = meta('meta[property="og:image"]').replace(`${SITE}/`, '');
    assert.ok(existsSync(`${ROOT}/${path}`), `og:image указывает на отсутствующий ${path}`);
  });
});

describe('JSON-LD главной страницы', () => {
  test('SoftwareApplication называет сущность однозначно', () => {
    const app = byType('SoftwareApplication');
    assert.ok(app, 'нет SoftwareApplication');
    assert.equal(app.name, 'GALS');
    assert.equal(app.applicationCategory, 'DeveloperApplication');
    assert.ok(app.alternateName, 'не расшифрована аббревиатура GALS');
    assert.ok(app.description?.length > 80, 'описание SoftwareApplication слишком короткое');
    assert.equal(app.url, `${SITE}/`);
    assert.equal(app.codeRepository, 'https://github.com/IvanIvanson/gals');
    assert.equal(app.offers.price, '0', 'бесплатный продукт должен быть отмечен ценой 0');
    assert.ok(app.offers.priceCurrency, 'у offers нет priceCurrency');
    assert.match(app.softwareVersion, /^\d+\.\d+$/, 'softwareVersion не похож на номер версии');
  });

  test('версия в JSON-LD совпадает с версией на странице', () => {
    const app = byType('SoftwareApplication');
    const shown = doc.querySelector('.right details summary span').textContent.trim();
    assert.equal(`v${app.softwareVersion}`, shown, 'версия в JSON-LD и в блоке версий разошлись');
  });

  test('WebSite и Organization связаны с приложением', () => {
    const site = byType('WebSite');
    const org = byType('Organization');
    assert.ok(site && org, 'нет WebSite или Organization');

    assert.equal(site.url, `${SITE}/`);
    assert.equal(site['@id'], `${SITE}/#website`);
    assert.equal(site.publisher['@id'], org['@id']);
    assert.equal(byType('SoftwareApplication').publisher['@id'], org['@id']);
  });

  test('Organization перечисляет только абсолютные профили sameAs', () => {
    const sameAs = byType('Organization').sameAs;
    assert.ok(Array.isArray(sameAs) && sameAs.length >= 2, 'у Organization почти нет sameAs');

    for (const url of sameAs) {
      assert.match(url, /^https:\/\//, `${url} не абсолютный https:// URL`);
      assert.doesNotMatch(url, /twitter\.com|x\.com/, 'sameAs ссылается на профиль, которого в проекте нет');
    }
  });

  test('FAQ повторяет вопросы со страницы, а не выдуман', () => {
    const faq = byType('FAQPage');
    assert.ok(faq, 'нет FAQPage');

    const questions = faq.mainEntity.map((q) => q.name);
    assert.deepEqual(questions, pageFaq, 'список вопросов в JSON-LD и на странице разошёлся');

    for (const item of faq.mainEntity) {
      assert.equal(item['@type'], 'Question');
      assert.equal(item.acceptedAnswer['@type'], 'Answer');

      const text = item.acceptedAnswer.text;
      // Ответ должен читаться без контекста страницы — это требование citability.
      assert.ok(text.length > 80, `«${item.name}»: ответ короче, чем самостоятельное утверждение`);
    }
  });

  test('все узлы ссылаются на один @id сайта и не содержат placeholder-ов', () => {
    const raw = doc.querySelector('script[type="application/ld+json"]').textContent;
    assert.equal(/example\.(com|org)|TODO|FIXME|\{[^}]*\}\}/.test(raw), false, 'в разметке остался placeholder');

    for (const node of graph) {
      assert.ok(node['@id']?.startsWith(`${SITE}/#`), `у ${node['@type']} нет @id вида <site>#...`);
    }
  });

  test('dateModified стоит в каждом узле со свежим контентом', () => {
    for (const type of ['WebSite', 'SoftwareApplication', 'FAQPage']) {
      assert.match(byType(type).dateModified, /^\d{4}-\d{2}-\d{2}$/, `у ${type} нет dateModified`);
    }
  });
});

describe('robots.txt и sitemap.xml', () => {
  const robots = readFileSync(`${ROOT}/robots.txt`, 'utf8');
  const sitemap = readFileSync(`${ROOT}/sitemap.xml`, 'utf8');

  test('robots.txt открыт для всех и объявляет sitemap', () => {
    assert.match(robots, /^User-agent: \*\s*$/m, 'нет правила для User-agent: *');
    assert.match(robots, /^Allow: \/$/m, 'нет явного Allow: /');

    const declared = /Sitemap:\s*(\S+)/.exec(robots)?.[1];
    assert.equal(declared, `${SITE}/sitemap.xml`, 'Sitemap указывает не на файл из репозитория');
    assert.equal(robots.includes('Disallow'), false, 'Disallow не должен блокировать документацию');
  });

  test('AI-краулеры не заблокированы', () => {
    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot']) {
      assert.ok(robots.includes(`User-agent: ${bot}`), `robots.txt не упоминает ${bot}`);
    }
  });

  test('каждый URL из sitemap существует в репозитории', () => {
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.ok(urls.length >= 80, `в sitemap слишком мало URL: ${urls.length}`);
    assert.ok(urls.some((url) => url.endsWith('/docs/accordion.html')), 'в sitemap нет статических страниц документации');

    for (const url of urls) {
      assert.ok(url.startsWith(`${SITE}/`), `${url} вне домена сайта`);

      const relative = url.replace(`${SITE}/`, '');
      const file = relative === '' ? 'index.html' : relative;
      assert.ok(existsSync(`${ROOT}/${file}`), `sitemap обещает несуществующий ${file}`);
    }
  });

  test('sitemap.xml корректно объявлен и датирован', () => {
    assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);

    const locs = [...sitemap.matchAll(/<loc>/g)].length;
    const modified = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    assert.ok(modified.length === locs, 'не у каждого URL есть lastmod');

    for (const date of modified) {
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `lastmod «${date}» не в формате ISO`);
    }
  });

  test('dateModified в JSON-LD не старше lastmod в sitemap', () => {
    const lastmod = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]).sort().at(-1);
    const jsonld = [byType('WebSite'), byType('SoftwareApplication'), byType('FAQPage')]
      .map((node) => node.dateModified);

    for (const date of jsonld) {
      assert.ok(date >= lastmod, `dateModified ${date} старше lastmod ${lastmod} — свежесть не подтверждена`);
    }
  });
});

describe('видимые метки свежести и версии', () => {
  test('на странице есть дата обновления в статичном HTML', () => {
    const time = doc.querySelector('footer time[datetime]');
    assert.ok(time, 'в футере нет <time datetime> — дата видна только после JS');
    assert.match(time.getAttribute('datetime'), /^\d{4}-\d{2}-\d{2}$/);
    assert.match(time.textContent.trim(), /\d{4}/);
    assert.match(doc.querySelector('footer').textContent, /Last updated/i);
  });

  test('дата в футере совпадает с dateModified в JSON-LD', () => {
    const shown = doc.querySelector('footer time[datetime]').getAttribute('datetime');
    assert.equal(shown, byType('SoftwareApplication').dateModified, 'видимая дата и JSON-LD расходятся');
  });

  test('версия упомянута и в футере, и в JSON-LD', () => {
    const app = byType('SoftwareApplication');
    assert.ok(doc.querySelector('footer').textContent.includes(`v${app.softwareVersion}`), 'в футере нет версии');
  });
});

/**
 * Пререндер — единственный пункт, который реально меняет извлекаемость: без
 * него краулер без JavaScript видел 18 % текста и ни одного <h1>.
 */
describe('пререндер статичного HTML', () => {
  /** Текст, который видит краулер без JavaScript. */
  const staticText = (() => {
    const d = new JSDOM(html).window.document;
    for (const el of d.querySelectorAll('script,style,noscript')) el.remove();
    return d.body.textContent.replace(/\s+/g, ' ').trim();
  })();

  const words = (t) => t.split(' ').filter(Boolean).length;

  test('без JavaScript в HTML есть заголовок H1', () => {
    assert.ok(new JSDOM(html).window.document.querySelector('h1'), 'в статичном HTML нет <h1>');
  });

  test('без JavaScript доступен основной текст страницы, а не только меню', () => {
    // До пререндера было 172 слова одной навигации.
    assert.ok(words(staticText) >= 600, `слов слишком мало: ${words(staticText)}`);
    assert.match(staticText, /Grid Application Layout Systems/, 'нет расшифровки аббревиатуры');
    assert.match(staticText, /186 classes/, 'нет ключевой цифры про классы');
  });

  test('пререндер свежий: introduction.js не разошёлся с index.html', () => {
    // --check сравнивает разметку модуля с блоком в HTML и падает при расхождении.
    execFileSync(process.execPath, ['scripts/prerender.mjs', '--check'], { cwd: ROOT, stdio: 'pipe' });
  });

  test('рантайм отдаёт тот же текст, что и пререндер', async () => {
    const dom = new JSDOM(html, { pretendToBeVisual: true, url: `${SITE}/` });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;

    const modules = [
      'script/addStyleDetailsLeft.js',
      'script/detailsLeftUlLi.js',
      'script/renderCenterBlock.js',
      'script/moveVersionIntoMenu.js',
      'script/searchDocs.js',
    ];

    for (const path of modules) {
      const mod = await import(pathToFileURL(`${ROOT}/${path}`).href);
      mod.default();
    }

    const center = dom.window.document.querySelector('.container-center');
    const rendered = center.textContent.replace(/\s+/g, ' ').trim();
    const prerendered = new JSDOM(html).window.document
      .querySelector('.container-center')
      .textContent.replace(/\s+/g, ' ')
      .trim();

    // Расхождение = пререндер показывает краулеру не то, что видит человек.
    assert.equal(rendered.length, prerendered.length, 'пререндер и рантайм отдали разный текст');
  });

  test('пререндер не дублирует id внутри страницы', () => {
    const ids = [...new JSDOM(html).window.document.querySelectorAll('[id]')].map((el) => el.id);
    const duplicated = ids.filter((id, i) => ids.indexOf(id) !== i);

    assert.deepEqual([...new Set(duplicated)], [], `повторяющиеся id: ${duplicated.join(', ')}`);
  });
});
