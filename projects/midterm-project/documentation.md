
# Video Games

---

Name: Darren Kam

Date: April 7th, 2020

Project Topic: Video Games

URL: 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: Name        `Type: String`
- `Field 2`: Price       `Type: Number`
- `Field 3`: Rating      `Type: Number`
- `Field 4`: Genre       `Type: String`
- `Field 5`: Consoles    `Type: [String]`


Schema: 
```javascript
{
    name: String,
    price: Number,
    rating: Number, 
    genre: String,
    consoles: [String]
}
```

### 2. Add New Data

HTML form route: `/addGame`

POST endpoint route: `/api/addGame`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: "POST",
    url: "http://localhost:3000/api/addGame",
    headers: { 
        "content-type": "application/x-www-form-urlencoded"
    },
    form: { 
        name: "Dauntless", 
        price: 0,
        rating: 7.5,
        genre: "Action RPG"
        consoles: ["Playstation 4", "Nintendo Switch", "Xbox One", "PC"]
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getGames`

### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Alphabetical -> `/alphabetical`
2. Free Games -> `/free`
3. Sort by Rating -> `/highest_rated`
4. Select by Genre -> `/genre/:genre_type`
5. Select by Console -> `/console/:console_name`
