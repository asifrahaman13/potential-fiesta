## Getting Started
## Chat Application

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

Now run the backend 

```
uvicron main:app --reload
```

## Front end 

Open another terminal to move to the front end.

```
cd frontend/
```

Install the required packages

```
yarn install
```

Next run the development server

```
yarn run dev
```