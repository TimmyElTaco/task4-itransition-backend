# How to run the application

## Dev

1. Clone the repository
2. Rename the ```.env.template``` file to ```.env``` and asign your own variables
3. Run the command ```npm install``` to install all the dependencies
4. Create the docker container with ```docker compose up -d```  for the database
5. Run the prisma migration with ```npx prisma migrate``` 