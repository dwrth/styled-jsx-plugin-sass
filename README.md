# styled-jsx-plugin-sass

This is a fork of https://github.com/giuseppeg/styled-jsx-plugin-sass

Difference: 
 - this package uses sass instead of node-sass

## Usage

Install the package first.

```bash
npm install --save-dev https://github.com/dwrth/styled-jsx-plugin-sass
```

Install the `sass` version you need (it is a peer dependency).

```bash
npm install --save-dev sass
```

Next, add `styled-jsx-plugin-sass` to the `styled-jsx`'s `plugins` in your babel configuration:

```json
{
  "plugins": [
    [
      "styled-jsx/babel",
      { "plugins": ["styled-jsx-plugin-sass"] }
    ]
  ]
}
```

## Node-sass options

Node-sass can be configured using `sassOptions`. This is useful for setting options such as `includePaths` or `precision`.

```json
{
  "plugins": [
    [
      "styled-jsx/babel",
      {
        "plugins": [
          ["styled-jsx-plugin-sass", {
              "sassOptions": {
                "includePaths": ["./styles"],
                "precision": 2
              }
            }
          ]
        ]
      }
    ]
  ]
}
```
