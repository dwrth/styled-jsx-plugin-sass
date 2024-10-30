const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const stripIndent = require('strip-indent');
const plugin = require('./index.js');

const cleanup = (str) => stripIndent(str).trim();

describe('styled-jsx-dart-sass', () => {
	it('compiles basic Sass syntax', () => {
		const result = plugin('div { color: red; }', {});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          color: red;
        }
      `)
		);
	});

	it('handles nested styles', () => {
		const result = plugin('div { p { color: blue; } }', {});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div p {
          color: blue;
        }
      `)
		);
	});

	it('processes Sass variables', () => {
		const result = plugin('$color: red; div { color: $color; }', {});
		assert.strictEqual(
			result.trim(),
			cleanup(`
        div {
          color: red;
        }
      `)
		);
	});

	it('applies mixins correctly', () => {
		const result = plugin(
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

	it('compiles media queries', () => {
		const result = plugin(
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

	it('works with @import', () => {
		const result = plugin('@import "fixture"; p { color: red }', {
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

	it('resolves imports correctly', () => {
		const filename = 'fixtures/entry.scss';
		const file = fs.readFileSync(filename);

		const result = plugin(file.toString(), {
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
