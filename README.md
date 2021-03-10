# RedFlagsOnline
This is a web app version of the popular party game "Red Flags"

## About the game
Red flags is a party game involving 400 cards, in which players have to set up other players with horrible dates, using perk cards to make a great date for the judge, and using Red Flag cards to make someone else's date look like a  garbage person.

## Installing web app
I've only just started this project, so the setup instructions won't be complete yet.

You'll need to rename the file `/src/config/example-config.env` to `/src/config/.env` as well as fill in the values, as explained below.
```
/* Database information */
DB_HOST=localhost 
DB_USERNAME=username
DB_PASSWORD=password
DB_NAME=dbname

/* Express session secret, change to a random string */
EXPRESS_SECRET=randomString

/* Port that express will listen to */
EXPRESS_PORT = 5000
```
You'll need to install the project dependencies using `npm install`. You can then run the project using `node run start` which will compile the typescript and run the result.
