import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');

test('each game opens its supplied MediaFire destination safely', () => {
  const expected = [
    ['老虎机少女', 'qpu3xxnqmt8xgf6'], ['幸存者少女', 'u73obhre6i8cmo1'],
    ['大富翁少女', 'x0y1cy0jkwshkly'], ['宝石少女', '3ssxp5n57iw49kb'],
    ['球球少女', 'ds29rsyixakced1'], ['祖玛少女', '9vonrjd073iz3op'],
  ];
  const cards = [...html.matchAll(/<article class="game-card">([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, expected.length);
  for (const [name, fileId] of expected) {
    const card = cards.find(([, content]) => content.includes(`<h3>${name}</h3>`));
    assert.ok(card, `Missing game: ${name}`);
    const link = card[1].match(/<a class="download-link"[^>]+>/)?.[0];
    assert.ok(link, `Missing download: ${name}`);
    const url = new URL(link.match(/href="([^"]+)"/)[1]);
    assert.equal(url.origin, 'https://www.mediafire.com');
    assert.equal(url.pathname.split('/')[2], fileId, `Wrong download: ${name}`);
    assert.ok(url.pathname.endsWith('/file'));
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
    assert.match(link, /aria-label="[^"]+"/);
  }
  assert.match(cards.find(([, content]) => content.includes('<h3>球球少女</h3>'))[1], /斗地主少女/);
});

test('assets resolve under the repository subpath and are real PNG files', async () => {
  const refs = [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map(match => match[1]);
  assert.ok(refs.includes('./style.css'));
  assert.equal(new Set(refs.filter(path => path.endsWith('.png'))).size, 7);
  for (const path of new Set(refs)) {
    await access(new URL(path, root));
    if (!path.endsWith('.png')) continue;
    const file = await readFile(new URL(path, root));
    assert.equal(file.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.ok(file.readUInt32BE(16) >= 184);
  }
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/);
});

test('navigation targets exist and core downloads work without JavaScript', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `Missing anchor: ${target}`);
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /name="viewport"/);
  assert.doesNotMatch(html, /<script/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.equal([...html.matchAll(/<details>/g)].length, 4);
});
