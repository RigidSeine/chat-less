#Installation
- Installed Node.js via .msi file.
- Tried running `npx create-react-app client` only to get an error:
`ENOENT: no such file or directory, lstat 'C:\Users\User\AppData\Roaming\npm'`
- Resolved by creating the npm folder in the directory. https://docs.npmjs.com/common-errors#error-enoent-stat-cusersuserappdataroamingnpm-on-windows-7 also has a common errors for npm.
- Upon installing create-react-app, `npm audit` warns of vulnerabilities immediately. It is known that `npm audit` creates a lot of false positives. https://overreacted.io/npm-audit-broken-by-design/
- Because `npm audit` was run, that broke some dependencies.
- Installed `vite` instead using `npm create vite@latest client -- --template react` which allows for cleaning of the destination folder to install new fresh dependencies and files.