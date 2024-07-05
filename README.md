# Ivy 🌿 (beta)

Ivy is a simple, lightweight, and fast 2FA management solution for Minecraft servers.

## Download Ivy

You can download the latest version of Ivy from the [Releases](https://github.com/prettyflowerss/ivy/releases) page.

## Using Ivy

In order to use Ivy, you'll first need to create an Ivy Admin account. This account will be used to manage your servers, users, etc. Head over to [Ivy's website](https://ivy.astrid.sh/auth) to create an account.

Once you've created your account, you'll be at the [Ivy Dashboard](https://ivy.astrid.sh/dashboard), where you can create your first server. When you've created your server, you'll be given an API key that you can put inside of `/plugins/ivy/config.toml` in order to use the plugin.

### Adding users

In order to add users to your server, you'll need to go in game and execute the `/ivy add [player]` command. This will send the player a link to setup their 2FA. (You can also execute this command for yourself)


> [!NOTE]
> Later on, you'll be able to add users from the dashboard.

### Setting up restricted commands

In order to restrict commands to only be usable by users with 2FA enabled, you'll need to find the `blockedCommands` section within your Ivy config file. This section contains a list of commands that are blocked from being used by players who are not currently authorized.


## Parts of Ivy

This repository is split into two different parts:

- The [`web`](/web) folder contains the core logic, it contains the frontend and the backend.
- The [`plugin`](/plugin) folder is where the plugin source code lives.

## Ivy Stack

Ivy is built on top of the following technologies:

- [Bun](https://bun.sh/)
- [Drizzle](https://orm.drizzle.team/) w/ [PostgreSQL](https://www.postgresql.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## License

Ivy is licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).