# wheelswatcher
A node app on AWS (PERN stack)

Easily Deploy Full Stack Node.js Apps on AWS EC2 | Step-by-Step Tutorial
https://www.youtube.com/watch?v=nQdyiK7-VlQ

Snippets: 
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