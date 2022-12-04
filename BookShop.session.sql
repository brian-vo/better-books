DROP DATABASE bookshopdb;

CREATE DATABASE bookshopdb;

USE bookshopdb;

CREATE TABLE USER (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(15) NOT NULL,
    lname VARCHAR(15) NOT NULL,
    email VARCHAR(30) UNIQUE,
    address VARCHAR(40),
    pass_word VARCHAR(100) NOT NULL
);

CREATE TABLE ADMIN (
    user_id INT NOT NULL PRIMARY KEY,
    CHECK (user_id > 0),
    Start_date DATE,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE CUSTOMER (
    user_id INT NOT NULL PRIMARY KEY,
    CHECK (user_id > 0),
    loyalty_points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE WISHLIST (
    wishlist_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE BOOK (
    isbn CHAR(13) NOT NULL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(300) DEFAULT 'No description available',
    language VARCHAR(15) DEFAULT 'English',
    stock INT NOT NULL,
    CHECK (stock >= 0),
    price INT NOT NULL,
    CHECK (price >= 0),
    cover_type VARCHAR(10),
    image_location VARCHAR(255) DEFAULT NULL
);

CREATE TABLE INCLUDES (
    wishlist_id INT NOT NULL REFERENCES WISHLIST(wishlist_id),
    CHECK (wishlist_id > 0),
    isbn CHAR(13) NOT NULL REFERENCES BOOK(isbn),
    PRIMARY KEY (wishlist_id, isbn)
);

CREATE TABLE RECOMMENDATION (
    recommend_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    recipient_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE SENDS (
    recommend_id INT NOT NULL REFERENCES RECOMMENDATION(recommend_id),
    CHECK (recommend_id > 0),
    isbn CHAR(13) NOT NULL REFERENCES BOOK(isbn),
    PRIMARY KEY (recommend_id, isbn)
);

CREATE TABLE AUTHOR(
    author_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(15) NOT NULL,
    lname VARCHAR(15) NOT NULL
);

CREATE TABLE AUTHOR_NAMES (
    recommend_id INT NOT NULL REFERENCES RECOMMENDATION(recommend_id),
    CHECK (recommend_id > 0),
    author_id INT NOT NULL REFERENCES AUTHOR(author_id),
    CHECK (author_id > 0),
    PRIMARY KEY (recommend_id, author_id)
);

CREATE TABLE SHOPPING_CART (
    cart_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    CHECK (user_id > 0),
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE BOOK_ORDER (
    order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    CHECK (user_id > 0),
    shipping_address VARCHAR(300) NOT NULL,
    STATUS VARCHAR(30) DEFAULT 'UNFULFILLED',
    order_date DATE DEFAULT (CURRENT_DATE),
    prepared_date DATE DEFAULT NULL,
    shipped_date DATE DEFAULT NULL,
    delivered_date DATE DEFAULT NULL,
    payment_method VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE DERIVED_FROM (
    cart_id INT NOT NULL REFERENCES SHOPPING_CART(cart_id),
    CHECK (cart_id > 0),
    order_id INT NOT NULL REFERENCES BOOK_ORDER(order_id),
    CHECK (order_id > 0),
    PRIMARY KEY (cart_id, order_id)
);

CREATE TABLE ISBNS (
    order_id INT NOT NULL REFERENCES BOOK_ORDER(order_id),
    CHECK (order_id > 0),
    isbn CHAR(13) NOT NULL REFERENCES BOOK(isbn),
    amount INT NOT NULL,
    CHECK(amount > 0),
    PRIMARY KEY (order_id, isbn)
);

CREATE TABLE STORES (
    cart_id INT NOT NULL REFERENCES SHOPPING_CART(cart_id),
    CHECK (cart_id > 0),
    isbn CHAR(13) NOT NULL REFERENCES BOOK(isbn),
    amount INT NOT NULL,
    CHECK(amount > 0),
    PRIMARY KEY (cart_id, isbn)
);

CREATE TABLE GENRES (
    isbn CHAR(13) NOT NULL,
    genre VARCHAR(40) NOT NULL,
    PRIMARY KEY (isbn, genre),
    FOREIGN KEY (isbn) REFERENCES BOOK(isbn)
);

CREATE TABLE WRITES (
    isbn CHAR(13) NOT NULL REFERENCES BOOK(isbn),
    author_id INT NOT NULL REFERENCES AUTHOR(author_id),
    CHECK (author_id > 0),
    PRIMARY KEY (isbn, author_id)
);

CREATE TABLE REVIEW (
    user_id INT NOT NULL,
    CHECK (user_id > 0),
    isbn CHAR(13) NOT NULL,
    message_title VARCHAR(40) NOT NULL,
    message_body VARCHAR(2500),
    post_date DATE DEFAULT (CURRENT_DATE),
    rating DECIMAL(2, 1) NOT NULL,
    PRIMARY KEY (user_id, isbn),
    FOREIGN KEY (user_id) REFERENCES USER(user_id),
    FOREIGN KEY (isbn) REFERENCES BOOK(isbn)
);

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        1,
        'Antony',
        'Watson',
        'wyatt.vandervort@gmail.com',
        'U?{Zp7/X'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        2,
        'Caroline',
        'Howard',
        'schmeler.elsa@hotmail.com',
        'cE]??Z8P'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        3,
        'Sam',
        'Turner',
        'ekeeling@yahoo.com',
        'L)2NrhEN'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        4,
        'Lenny',
        'Johnson',
        'eugenia.swift@gmail.com',
        '}+.krE5}'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        5,
        'Mary',
        'Mason',
        'toy.isaiah@anderson.com',
        '!Jg5m*^s'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        6,
        'Kelvin',
        'Spencer',
        'malika08@yahoo.com',
        '^3G]4zWg'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        7,
        'Penelope',
        'Morgan',
        'schmidt.isaiah@yahoo.com',
        '*8ErbdWW'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        8,
        'Maximilian',
        'Hamilton',
        'dewitt88@yahoo.com',
        'nAmxA5H!'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        9,
        'Violet',
        'Gray',
        'ewintheiser@hotmail.com',
        'AmmqK8/m'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        10,
        'Stella',
        'Anderson',
        'frances39@doyle.com',
        'x4{H(jRG'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        11,
        'Marcus',
        'Barnes',
        'lang.josue@hotmail.com',
        'D[rcFZ28'
    );

INSERT INTO
    USER(user_id, fname, lname, email, pass_word)
VALUES
    (
        12,
        'Honey',
        'Lloyd',
        'aurelie09@yahoo.com',
        'vQ?6!y)}'
    );

INSERT INTO
    ADMIN(user_id, Start_date)
VALUES
    (8, '2020-01-01');

INSERT INTO
    ADMIN(user_id, Start_date)
VALUES
    (4, '2020-10-03');

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (1, 677);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (2, 552);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (3, 620);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (5, 78);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (6, 656);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (7, 850);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (9, 355);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (10, 168);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (11, 511);

INSERT INTO
    CUSTOMER(user_id, loyalty_points)
VALUES
    (12, 344);

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        6931871780962,
        'It Starts with Us: A Novel',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        25,
        '9.99',
        'HARDCOVER',
        '/img/startswithus.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        7632537100609,
        'If He Had Been with Me',
        NULL,
        NULL,
        22,
        '5.99',
        'PAPERBACK',
        '/img/ifhehad.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        9454144122432,
        'It Ends with Us',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        'Spanish',
        2,
        '14.99',
        'HARDCOVER',
        '/img/itendswith.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        4684536450026,
        'A Court of Wings and Ruin (A Court of Thorns and Roses Series #3)',
        NULL,
        NULL,
        1,
        '14.99',
        'PAPERBACK',
        '/img/wingsandruin.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        2378446085332,
        'A Court of Mist and Fury (A Court of Thorns and Roses Series #2)',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        4,
        '19.99',
        'PAPERBACK',
        '/img/mistandfury.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        5930532440712,
        'Haunting Adeline',
        NULL,
        NULL,
        20,
        '9.99',
        'HARDCOVER',
        '/img/haunting.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        3942818403374,
        'A Court of Thorns and Roses (A Court of Thorns and Roses Series #1)',
        NULL,
        NULL,
        11,
        '19.99',
        'PAPERBACK',
        '/img/thornandroses.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        5880606495172,
        'Twisted Lies (Twisted Series #4)',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        9,
        '19.99',
        'HARDCOVER',
        '/img/twistedlies.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        3934082997736,
        'Twisted Love (Twisted Series #1)',
        NULL,
        NULL,
        25,
        '9.99',
        'PAPERBACK',
        '/img/twistedlove.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        6070100089245,
        'Twisted Games (Twisted Series #2)',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        1,
        '5.99',
        'HARDCOVER',
        '/img/twistedgames.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        3296389830024,
        'Verity',
        NULL,
        'French',
        6,
        '19.99',
        'PAPERBACK',
        '/img/verity.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        4775118393497,
        'A Court of Frost and Starlight (A Court of Thorns and Roses Series)',
        NULL,
        NULL,
        6,
        '9.99',
        'HARDCOVER',
        '/img/frostandstarlight.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        4181687194052,
        'The Seven Husbands of Evelyn Hugo: A Novel',
        NULL,
        'Spanish',
        22,
        '24.99',
        'PAPERBACK',
        '/img/sevenhusbands.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        4919612262648,
        'Where the Crawdads Sing',
        NULL,
        NULL,
        11,
        '14.99',
        'PAPERBACK',
        '/img/crawdads.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        1777133692241,
        'The Inheritance Games (Inheritance Games Series #1)',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        22,
        '5.99',
        'HARDCOVER',
        '/img/inheritancegame.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        7500610199250,
        'The Appeal: A Novel',
        NULL,
        NULL,
        19,
        '24.99',
        'PAPERBACK',
        '/img/appeal.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        9712873192964,
        'The Silent Patient',
        NULL,
        NULL,
        20,
        '9.99',
        'HARDCOVER',
        '/img/silent.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        7151789596475,
        'Ugly Love',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        9,
        '6.99',
        'PAPERBACK',
        '/img/uglylove.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        1374063041667,
        'Hooked',
        NULL,
        NULL,
        10,
        '6.99',
        'HARDCOVER',
        '/img/hooked.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        1507084220223,
        'Terms and Conditions',
        NULL,
        'French',
        8,
        '9.99',
        'PAPERBACK',
        '/img/terms.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        7018452427578,
        'The Fine Print',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis ullamcorper purus, sed condimentum velit dapibus in. Aliquam bibendum metus quis aliquet sollicitudin. Ut sollicitudin at diam eget pellentesque.',
        NULL,
        12,
        '5.99',
        'HARDCOVER',
        '/img/fineprint.jpg'
    );

INSERT INTO
    BOOK(
        isbn,
        title,
        description,
        language,
        stock,
        price,
        cover_type,
        image_location
    )
VALUES
    (
        4828063101686,
        'The Way I Used to Be',
        NULL,
        NULL,
        6,
        '14.99',
        'PAPERBACK',
        '/img/wayiused.jpg'
    );

INSERT INTO
    WISHLIST(wishlist_id, user_id)
VALUES
    (1, 1);

INSERT INTO
    WISHLIST(wishlist_id, user_id)
VALUES
    (2, 2);

INSERT INTO
    WISHLIST(wishlist_id, user_id)
VALUES
    (3, 3);

INSERT INTO
    WISHLIST(wishlist_id, user_id)
VALUES
    (4, 4);

INSERT INTO
    WISHLIST(wishlist_id, user_id)
VALUES
    (5, 5);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 6931871780962);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 7632537100609);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 9454144122432);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 4684536450026);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 5880606495172);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 3296389830024);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (1, 4919612262648);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (2, 2378446085332);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (2, 5930532440712);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (3, 3942818403374);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (4, 5880606495172);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (4, 3934082997736);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (4, 6070100089245);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (4, 3296389830024);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (4, 4775118393497);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (5, 4181687194052);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (5, 4919612262648);

INSERT INTO
    INCLUDES(wishlist_id, isbn)
VALUES
    (5, 1777133692241);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (1, 1, 5);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (2, 1, 3);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (3, 1, 6);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (4, 1, 7);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (5, 1, 11);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (6, 1, 12);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (7, 7, 9);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (8, 7, 1);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (9, 9, 2);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (10, 11, 5);

INSERT INTO
    RECOMMENDATION(recommend_id, recipient_id, user_id)
VALUES
    (11, 6, 5);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (6, 4919612262648);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (6, 1777133692241);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (6, 7500610199250);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (7, 9712873192964);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (7, 7151789596475);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (8, 1374063041667);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (9, 1507084220223);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (10, 7018452427578);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (10, 3296389830024);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (10, 4775118393497);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (10, 4181687194052);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (11, 4919612262648);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (1, 3296389830024);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (2, 4775118393497);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (3, 4181687194052);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (4, 4919612262648);

INSERT INTO
    SENDS(recommend_id, isbn)
VALUES
    (5, 4775118393497);

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (1, 'Florrie', 'Kelly');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (2, 'Dominik', 'Davis');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (3, 'Eddy', 'Armstrong');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (4, 'Abigail', 'Barrett');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (5, 'Lydia', 'Cameron');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (6, 'Tess', 'Ellis');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (7, 'Ned', 'Brooks');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (8, 'Kevin', 'Mitchell');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (9, 'Ted', 'Elliott');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (10, 'Briony', 'West');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (11, 'Melanie', 'Harris');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (12, 'Maya', 'Hamilton');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (13, 'David', 'Farrell');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (14, 'Emma', 'Ryan');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (15, 'Jacob', 'Farrell');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (16, 'Brad', 'Moore');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (17, 'Belinda', 'Morrison');

INSERT INTO
    AUTHOR(author_id, fname, lname)
VALUES
    (18, 'Ada', 'Douglas');

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (6, 4);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (6, 5);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (7, 6);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (8, 7);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (9, 8);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (9, 9);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (10, 11);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (11, 12);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (11, 13);

INSERT INTO
    AUTHOR_NAMES(recommend_id, author_id)
VALUES
    (11, 14);

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        1,
        1,
        '44 E. West Street Ashland, OH 44805',
        'COMPLETE',
        '2022-09-28',
        '2022-09-29',
        '2022-09-30',
        '2022-10-05',
        'Visa'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        2,
        1,
        '131 Iroquois Street Southgate, MI 48195',
        'UNFULFILLED',
        '2022-11-03',
        NULL,
        NULL,
        NULL,
        'Mastercard'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        3,
        6,
        '8779 Windsor St. Fuquay Varina, NC 27526',
        'CANCELLED',
        '2022-09-06',
        NULL,
        NULL,
        NULL,
        'Mastercard'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        4,
        11,
        '611 Penn Street Long Branch, NJ 07740',
        'CANCELLED',
        '2022-07-07',
        NULL,
        NULL,
        NULL,
        'Visa'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        5,
        7,
        '7365 Cherry Hill Court Kingston, NY 12401',
        'COMPLETE',
        '2022-10-12',
        '2022-10-13',
        '2022-10-14',
        '2022-10-16',
        'Visa'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        6,
        6,
        '8551 St Margarets Road Seymour, IN 47274',
        'COMPLETE',
        '2022-08-08',
        '2022-08-10',
        '2022-08-11',
        '2022-08-18',
        'Mastercard'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        7,
        9,
        '7459 Gulf Lane Raeford, NC 28376',
        'SHIPPED',
        '2022-11-17',
        '2022-11-19',
        '2022-11-20',
        NULL,
        'Visa'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        8,
        1,
        '131 Iroquois Street Southgate, MI 48195',
        'UNFULFILLED',
        '2022-11-04',
        NULL,
        NULL,
        NULL,
        'Mastercard'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        9,
        10,
        '105 French Run Road, Savannah GA 31404',
        'SHIPPED',
        '2022-11-19',
        '2022-11-20',
        '2022-11-21',
        NULL,
        'Visa'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        10,
        1,
        '131 Iroquois Street Southgate, MI 48195',
        'COMPLETE',
        '2022-09-28',
        '2022-09-29',
        '2022-09-30',
        '2022-10-05',
        'Mastercard'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        11,
        1,
        '131 Iroquois Street Southgate, MI 48195',
        'COMPLETE',
        '2022-09-12',
        '2022-09-14',
        '2022-09-15',
        '2022-09-22',
        'Mastercard'
    );

INSERT INTO
    BOOK_ORDER(
        order_id,
        user_id,
        shipping_address,
        STATUS,
        order_date,
        prepared_date,
        shipped_date,
        delivered_date,
        payment_method
    )
VALUES
    (
        12,
        1,
        '131 Iroquois Street Southgate, MI 48195',
        'COMPLETE',
        '2022-09-06',
        '2022-09-07',
        '2022-09-08',
        '2022-09-14',
        'Mastercard'
    );

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (1, 4684536450026, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (1, 2378446085332, 3);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (2, 5930532440712, 1);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (3, 3942818403374, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (3, 5880606495172, 1);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (4, 3934082997736, 1);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (4, 6070100089245, 3);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (4, 3296389830024, 1);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (5, 4775118393497, 3);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (6, 4181687194052, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (6, 4919612262648, 1);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (7, 1777133692241, 3);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (8, 7500610199250, 1);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (8, 9712873192964, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (8, 7151789596475, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (8, 1374063041667, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (9, 7500610199250, 3);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (10, 4181687194052, 2);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (11, 4919612262648, 3);

INSERT INTO
    ISBNS(order_id, isbn, amount)
VALUES
    (12, 1777133692241, 1);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (6931871780962, 1);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (7632537100609, 2);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (9454144122432, 3);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (4684536450026, 4);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (2378446085332, 5);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (5930532440712, 6);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (3942818403374, 7);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (5880606495172, 8);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (3934082997736, 9);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (6070100089245, 10);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (3296389830024, 11);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (4775118393497, 12);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (4181687194052, 13);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (4919612262648, 14);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (1777133692241, 15);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (7500610199250, 16);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (9712873192964, 17);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (7151789596475, 18);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (1374063041667, 9);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (1507084220223, 10);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (7018452427578, 11);

INSERT INTO
    WRITES(isbn, author_id)
VALUES
    (4828063101686, 12);

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        1,
        3934082997736,
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-05-10',
        4
    );

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        5,
        6070100089245,
        'Curabitur volutpat dui justo.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-09-15',
        3
    );

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        7,
        3296389830024,
        'Aliquam aliquam vestibulum mollis.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-11-09',
        5
    );

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        11,
        4775118393497,
        'Vivamus libero eros',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-11-24',
        5
    );

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        9,
        4181687194052,
        'Curabitur varius elit',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-10-13',
        1
    );

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        2,
        4181687194052,
        'Fusce sed maximus elit,',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-10-17',
        4
    );

INSERT INTO
    REVIEW(
        user_id,
        isbn,
        message_title,
        message_body,
        post_date,
        rating
    )
VALUES
    (
        2,
        4775118393497,
        'Vivamus libero eros',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo cursus tincidunt. Quisque pretium congue fringilla. Donec sed purus at tellus hendrerit vestibulum.',
        '2022-11-24',
        2
    );

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (6931871780962, 'famous');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (7632537100609, 'suggest');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (9454144122432, 'crop');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (4684536450026, 'share');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (2378446085332, 'scene');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (5930532440712, 'queen');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (3942818403374, 'energy');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (5880606495172, 'language');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (3934082997736, 'hill');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (6070100089245, 'glass');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (3296389830024, 'amount');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (4775118393497, 'explore');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (4181687194052, 'rays');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (4919612262648, 'truth');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (1777133692241, 'these');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (7500610199250, 'take');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (9712873192964, 'except');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (7151789596475, 'slept');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (1374063041667, 'nose');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (1507084220223, 'still');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (7018452427578, 'mirror');

INSERT INTO
    GENRES(isbn, genre)
VALUES
    (4828063101686, 'owner');