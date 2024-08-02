## Getting Started


![Screenshot from 2024-08-02 12-11-05](https://github.com/user-attachments/assets/7c606940-25b2-4871-9f4e-c5d0459b4b2c)


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
