# BetterBooks Book Store
BetterBooks is a responsive full stack web application designed to manage and streamline the operations of an ecommerce bookstore.

All essential ecommerce store features, including user authentication, product pages, search functionality, shopping cart and checkout system, and an admin interface, are implemented in BetterBooks
In addition to standard ecommerce features, we implemented a social recommendation system that allows users to send each other book recommendations and receive automatic recommendations based on their wishlist.

## Features
- User authentication with role-based access using Flask-Login and Flask-Principal
- Dynamic viewing, updating, and creation of data on the frontend using React
- Querying of a MySQL database through Flask-SQLAlchemy on a Flask server

## How It Was Made:
The backend of BetterBooks is powered by a MySQL database, which is accessed through Flask-SQLAlchemy on a Flask server. User authentication and role-based access are implemented using Flask-Login and Flask-Principal. The frontend is created using React and CSS, allowing users to dynamically create, update, and view data.

### Languages Used
- JavaScript
- Python
- CSS

### Frameworks Used
- React
- Flask
- SQLAlchemy

## How to Run

`bookshop-data.sql` provides an example database (with data) in the MySQL format.
### Prerequisites
- Python 3.7+
- React 16.13.1+

### Setting Up the Development Environment
1. Clone the repository: 
```
git clone https://github.com/brian-vo/BetterBooksStore.git
```
2. Install the frontend dependencies: 
```
npm install
```
3. Install the backend dependencies 
```
cd api
pip install -r requirements.txt
```
4. Set up a MySQL database and configure the connection string, and secret keys in `/api/__init__.py`. See SQLAlchemy docs for formatting if not using MySQL:
```
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@server/db'
app.config['SECRET_KEY'] = 'PASSWORD-SECRET-KEY-HERE'
app.config["JWT_SECRET_KEY"] = "JWT-SECRET-KEY-HERE"
```

### Running the Project
1. Start the development server (also ensure that the SQL server is running): 
```
$env:FLASK_APP="__init__.py" 
python -m flask run
```
2. In a separate terminal, start the React development server: 
```
npm start
```
3. Open `http://localhost:3000` in your browser to view the app.


## Images
![Home Page](https://i.imgur.com/2lxth78.png)
![Product Page](https://i.imgur.com/xjrZFKn.png)
![Search Function](https://i.imgur.com/hID6IZk.png)
![Register Page](https://i.imgur.com/caYWH8K.png)
![Shopping Cart Page](https://i.imgur.com/Q0Pz9bP.png)
![Manage Account](https://i.imgur.com/wEKOOZj.png)
![Admin Page](https://i.imgur.com/5fgVTVO.png)


## Acknowledgements:
I would like to thank Unsplash for providing access to high-quality images for use as book covers on the website. All images from Unsplash are used under the Unsplash License, which allows for free use of the images for non-commercial purposes.

I would like to thank OpenClipart for providing the logo for our website. The logo was sourced from OpenClipart and is used under the Creative Commons Zero 1.0 Public Domain License.



