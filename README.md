# Kantina

![eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

A small e-commerce website for the stalls inside the universities. Bringing the benefits digitalization even on the small businesses with ease.

## Built with

- TypeScript
- SvelteKit
- TailwindCSS
- PocketBase
- and other [cool libraries](https://github.com/icabetong/me/blob/main/package.json)

## Forking/Cloning

You can use the source code of this website for your own, but please add some attributions such us, linking back to [icabetong.me](https://www.icabetong.me) or to this [GitHub Repository](https://www.github.com/icabetong/me-v2). Also, please remove my personal information, images, resume link and etc. Thanks!

## Setting up

If you wish to setup your own instance of Kantina, you primarily only need two things, a Pocketbase instance and an infrastructure to host it.

You can read more about Pocketbase on their [website](https://www.pocketbase.io).

### The Backend

Grab a copy of Pocketbase from their website and navigate to the folder where it's stored using the terminal.

Execute this command to the Terminal:

```zsh
./pocketbase serve
```

Open your browser then navigate to this URL: `http://127.0.0.1:8090/_/`

For the first time, create the first admin account and proceed to the **Settings** tab and **Import Collections** subtab respectively.

Click the `Load from JSON` button and browse the `pb_scheme.json` file included in this respository to import the required database schema for Kantina.

### The Front-End

With the Pocketbase instance running, open the project with your favorite code editor. Create a environment variables file (a `.env` file) in the root of the project.

Create a new entry with the name of `PUBLIC_API_ENDPOINT` and the value with the current local Pocketbase instance, (`http://127.0.0.1:8090`). The line should look like this:

```
PUBLIC_API_ENDPOINT=http://127.0.0.1:8090
```

Save the file, and run the front-end project. Type `npm dev` or `yarn dev` in your code editor's terminal to start.
