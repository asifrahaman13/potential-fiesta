## Adrax

Screenshoots

![Screenshot from 2024-08-02 12-11-05](https://github.com/user-attachments/assets/7c606940-25b2-4871-9f4e-c5d0459b4b2c)
![Screenshot from 2024-08-02 12-16-00](https://github.com/user-attachments/assets/500190e6-8908-4985-9573-abb41b1d65ae)
![Screenshot from 2024-08-02 12-15-26](https://github.com/user-attachments/assets/d32f3422-79d8-4989-be75-b3e6eb99aad2)


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
