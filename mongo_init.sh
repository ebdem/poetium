#! /bin/bash
mongoimport --db node_blog --collection users --type json --file /mongo-seed/users.json --jsonArray
