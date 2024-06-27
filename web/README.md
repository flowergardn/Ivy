# Ivy - Web

This is the web portion of the Ivy project. It's a monolitic app that contains the frontend and backend for Ivy.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install:

```
- Bun - https://bun.sh/
```

### Installing

A step by step series of examples that tell you how to get a development env running.

1. Clone the repo:

```bash
git clone https://github.com/prettyflowerss/ivy
```

2. Install the dependencies:

```bash
cd ivy
bun i
```

3. Start the database, available at `postgresql://postgres:password@localhost:5432/ivy` (or bring in your own Postgres database)

```bash
./start-database.sh
```

4. Setup the database:

Ivy uses [Drizzle](https://orm.drizzle.team) for its database interactions. To setup the database, run the following command:

```bash
bun run db:push
```

This should create the database and tables for you.

5. Set up the environment variables:

Ivy uses a very minimal set of environment variables. You can copy the `.env.example` file to `.env` and fill in the values.

6. Run the project!

```bash
bun run dev
```
