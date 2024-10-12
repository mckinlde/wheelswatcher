# wheelswatcher
A node app on AWS (PERN stack)

Easily Deploy Full Stack Node.js Apps on AWS EC2 | Step-by-Step Tutorial
https://www.youtube.com/watch?v=nQdyiK7-VlQ

There isn't a great tutorial for setting up an ALB w/target groups and SSL for routing traffic from 80->443->3000 to get the node app in a browser
Maybe I should make one, maybe I just need to have a better search
In any case, I think I have that working, and I can run both the server.js backend in the background and react app in the foreground with:
```
node /home/ec2-user/wheelswatcher/wheelswatcher/server.js &
cd /home/ec2-user/wheelswatcher/wheelswatcher
npm start
```

and then I expect to be able to go to carsalesignal.com and have it work.

In a previous test where I just opened ports and used a manual copy/paste of <public-ip>:3000 into the browser URL bar it did load and got a response from the database correctly.

So all we're testing now is DNS/NS/SSL/ALB/Route53 stuff, no meaningful code changes


Snippets: 
### keep both api and react app running in the background
```
npm install -g pm2
pm2 start serve --name react-app -- serve -s build -l 3000
pm2 start server.js --name express-server
```

### install git and node
```
sudo yum update -y
sudo yum install git -y
```
```
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo -E bash -
sudo yum install -y nodejs
```
### clone the repo, start with npm for test
```
git clone https://mckinlde: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@github.com/mckinlde/wheelswatcher.git
```
```
cd wheelswatcher/wheelswatcher
npm install
```
```
npm run build
```
```
npm start
```
### [install postgres](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html#CHAP_GettingStarted.Connecting.PostgreSQL)
```
sudo dnf install postgresql15
```
### postgres endpoint
```
database-1.cluster-ro-cvu2u86aui5t.us-west-2.rds.amazonaws.com
```
### connect ec2 to endpoint
```
psql --host=database-1.cluster-ro-cvu2u86aui5t.us-west-2.rds.amazonaws.com --port=5432 --dbname=seattlecars --username=postgres
```
### show tables
```
seattlecars=> \dt
```
### select
```
seattlecars=> select url, price, title from listings where area='seattle' and activity='removed by author' limit 100;
```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```
### 
```

```