# Contribution guildelines

👈🏻 Thanks for visiting this page and your interest in contributing to this repository.

First clone the repository.

```
git clone https://github.com/asifrahaman13/potential-fiesta.git
```

## Backend

Move to the backend directory
```
cd potential-fiesta/
```

Next create and activate the virtual environment. 

```
virtualenv .venv
source .venv/bin/activate
```
Install the necessary packages and dependencies

```
pip install -r requirements.txt
```

Create the .env file and give the necessary API Keys.

```
cp .env.example .env
```

Now run the backend 

```
uvicorn src.main:app --reload
```

## Front end 

Open another terminal to move to the front end.

```
cd frontend/
```

Install the required packages

```
bun install
```

Next run the development server

```
bun run dev
```
## Run with docker

The best way to utilize the docker is through the docker compose file.

`docker compose up -d`


## PORT 👨🏻‍🚀

- Backend: 8000
- Frontend: 3000