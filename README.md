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

It works for showing the node app, but DB queries are broken:
["[Warning] [blocked] The page at https://carsalesignal.com/ was not allowed to display insecure content from http://34.213.51.19:3001/query-listings. (main.b6897113.js, line 2)"]

What I needed to do was:
- make a target group associated with the ec2 that listens on 443 and forwards to a registered target on 3000:
{
    Target type
Instance
Protocol : Port
HTTPS: 443
Protocol version
HTTP1
VPC
vpc-07012e5dc59bf9c6b 
IP address type
IPv4
Load balancer
node-app-alb 
<>
Registered targets (1)  Info
Instance ID
i-086c6eca87228bb93
Name
host_node_app
Port
3000
Zone
us-west-2c
Health status
Healthy
}
- associate it with an ALB that has 2 listeners/rules, one redirects by url from 80->443 and the other forwards to target group above:
Protocol:Port
Default action
Rules
ARN
Security policy
Default SSL/TLS certificate
mTLS
Trust store
Trust store association status
Tags

HTTPS:443
Forward to target group
https443-to-instance3000 : 1 (100%)
Target group stickiness: Off
1 rule
ARN
ELBSecurityPolicy-TLS13-1-2-2021-06
carsalesignal.com (Certificate ID: f2b4c255-908d-4952-8da9-4ec8c142484f) 
Off
Not applicable
Not applicable
0 tags
HTTP:80
Redirect to HTTPS://#{host}:443/#{path}?#{query}
Status code: HTTP_301
1 rule
ARN
Not applicable
Not applicable
Not applicable
Not applicable
Not applicable
0 tags
- register an SSL certificate with Certificate Manager, update the CNAME record in Route53, and then associate the SSL with the ALB.

These steps are kinda out of order, you register the SSL first but it makes more sense to read them knowing that the SSL is for an ALB.

Next, I've gotta do something similar to get database queries working:
### 1. create another target group pointed at 3001
Target Group 2: For your API (port 3001).
Create a second target group with Instance as the target type.
Set the Port to 3001.
Register the same EC2 instance to this target group.
### 2. Configure Path-Based Routing in the ALB Listener:
In the AWS Console, go to the Load Balancers section.
Select your ALB and go to the Listeners tab.
For the HTTPS listener (port 443), modify the rules to set up path-based routing:
Path /: Forward traffic to the target group for the React app (port 3000).
Path /api/*: Forward traffic to the target group for the API (port 3001).
Here’s how you can do this:
Click on View/edit rules for the HTTPS listener. 
#### (((note: View/edit rules refers to *listener* in *ALB*, not the *target group*)  You end up with a console path like: Load balancers>node-app-alb>HTTPS:443 listener>Add rule)  And then the menu steps are 1.add rule 2. define rules conditions 3. set rule actions 4.set rule priority 5. review&create)
Add a new rule to forward /api/* requests to the API target group.
Ensure the default rule forwards traffic to the React app target group (for paths like / and /static/*).
### 3. Update React App API Requests: Update your React app’s API calls to use the /api/ path:
```
fetch('/api/query-listings')
```
### 4. Security Group Configuration: Ensure that your EC2 instance's security group allows inbound traffic from the ALB on both ports 3000 and 3001.
This is already done, but that's because it allows 3000/3001 traffic from anywhere; I'll want todo: limit ec2 security to only allow ALB on 3000/3001
### 5. Test the Setup: After making these changes:
Access the React app via https://carsalesignal.com.
Open the browser’s Network tab and verify that requests to /api/query-listings are properly routed to the API target group.
Summary:
Create two target groups: One for the React app (port 3000) and another for the API (port 3001).
Configure path-based routing: In the ALB listener, route /api/* to the API target group and / to the React app target group.
Update the React app to use /api/ in its API requests.
Ensure security groups are configured to allow traffic on the required ports.
This approach will allow you to serve both the React app and API through the same ALB without any mixed content or port issues.
### 6. be frusturated for several hours and finally get it to work by setting up ALB to go 80->3000/3001 instead of 443->3000/3001


# Snippets: 
## --------------------------
### run both the server.js backend in the background and react app in the foreground with:
```
node /home/ec2-user/wheelswatcher/wheelswatcher/server.js &
cd /home/ec2-user/wheelswatcher/wheelswatcher
npm start
```

### keep both api and react app running in the background with pm2
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