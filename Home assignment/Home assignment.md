# Assignment: User Leaderboard System

---

## Background:

Your gaming company has a rapidly growing user base, and you want to implement a user leaderboard system to showcase the top playersand the user position in the table.
Leaderbaord is an engagement & retention feature that can boost revenue.
It should show the user position, name, image , total score. refernce [leaderboard.png](leaderboard.png)
The leaderboard should be able to handle more than 10 million users efficiently.
Your tech stack includes Node.js, TypeScript, Postgres, and Redis (bouns) and work on localhost with k8s Docker file.

## Task:

Your task is to design, implement, and deploy a fully working user leaderboard system with the following components:

1. Data Structure Design:

Design an efficient data structure to store user scores and rankings for the leaderboard.
Consider the scalability and performance of your data structure for a large number of users.
Explain your data structure design choices in detail.

2. Database Schema:

Create database schema to store user information and scores.
Define the necessary tables, columns, and relationships.
Explain how your schema supports the leaderboard functionality.

3. API Implementation:

Create a API in Node.js (using TypeScript) to interact with the leaderboard system.
Implement the following API endpoints:

- Add a new user with a score.
- Update the score of a user.
- Retrieve the top N users on the leaderboard.
- Retrieve the user's position on the leaderboard along with 5 users above and 5 users below them.

(Bouns) - Use local Redis to cache leaderboard data for faster retrieval.
If not, use the local Postgres as you will use redis for optimization purposes.

4. AWS cloud implementation (only architecture):

- Create a AWS cloud implementation design for all the compuntents you think relevent for a scalable product

5. Testing: (Bouns section)

Write unit tests for your API endpoints.
Consider edge cases and scenarios with a large number of users.
Include clear instructions on how to run the tests.

6. Deployment:

Deploy your fully working server and database to a localhost environment
Please add Dockerfile as well for running on K8s

## Submission:

Please submit your solution as a fully working system with a deployed server and database Include a README section with instructions on how to access and use the deployed system and how to run the tests.
Please upload your work to a private Github repository. and share it with:

- sahar@sunfltd.com
- noam@sunfltd.com

## Time estimation:

The time limit for this is 4 hours. if this takes you more you can submit the code without finishing it fully.

## Evaluation Criteria:

You will be evaluated based on the efficiency of your data structure and database schema, the correctness and performance of your API, the completeness of your deployment.
