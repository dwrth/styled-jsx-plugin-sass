const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const stripIndent = require('strip-indent');
const plugin = require('./index.js');

const cleanup = (str) => stripIndent(str).trim();

describe('styled-jsx-plugin-sass', () => {
	it('compiles basic Sass syntax', async () => {
		const result = await plugin('div { color: red; }', {});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          color: red;
        }
      `)
		);
	});

	it('handles nested styles', async () => {
		const result = await plugin('div { p { color: blue; } }', {});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div p {
          color: blue;
        }
      `)
		);
	});

	it('processes Sass variables', async () => {
		const result = await plugin('$color: red; div { color: $color; }', {});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          color: red;
        }
      `)
		);
	});

	it('applies mixins correctly', async () => {
		const result = await plugin(
			`
        @mixin flex-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        div {
          @include flex-center;
        }
      `,
			{}
		);
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `)
		);
	});

	it('compiles media queries', async () => {
		const result = await plugin(
			`
        div {
          color: black;
          @media (min-width: 600px) {
            color: white;
          }
        }
      `,
			{}
		);
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          color: black;
        }
        @media (min-width: 600px) {
          div {
            color: white;
          }
        }
      `)
		);
	});

	it('works with @import', async () => {
		const result = await plugin('@import "fixture"; p { color: red }', {
			loadPaths: [path.resolve(__dirname, './fixtures')],
			babel: { filename: 'fixtures/entry.scss' },
		});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          color: red;
        }

        p {
          color: red;
        }
      `)
		);
	});

	it('resolves imports correctly', async () => {
		const filename = 'fixtures/entry.scss';
		const file = fs.readFileSync(filename);

		const result = await plugin(file.toString(), {
			babel: { filename },
			loadPaths: [path.resolve(__dirname, './fixtures')],
		});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        * {
          font-family: "Comic Sans MS" !important;
        }

        p {
          color: red;
        }
      `)
		);
	});
});
