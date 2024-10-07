aws is charging like $250/day for RDS, so we're gonna move the DB to local

# ------------------------ setup psql on your local machine

I'm using this guide to install porgresql on my mac:
https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/

```
brew install postgresql@15
```

```
brew services start postgresql
```
```
brew services stop postgresql
```

create a root user that will have administrator privileges to the database server. Make sure that the service is running and then run the following

```
psql postgres
```

```
CREATE ROLE newUser WITH LOGIN PASSWORD 'password';
ALTER ROLE newUser CREATEDB;
```
```
\q
psql postgres -U newuser
```

Installing PGAdmin to navigate Postgres Database server
Once installed, provide the credentials as follows.

host – “localhost”
user – “newuser”
password – “password”
maintenance database – “postgres”

```
Pruned 1 symbolic links from /usr/local
==> Caveats
==> postgresql@15
This formula has created a default database cluster with:
  initdb --locale=C -E UTF-8 /usr/local/var/postgresql@15

postgresql@15 is keg-only, which means it was not symlinked into /usr/local,
because this is an alternate version of another formula.

If you need to have postgresql@15 first in your PATH, run:
  echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc

For compilers to find postgresql@15 you may need to set:
  export LDFLAGS="-L/usr/local/opt/postgresql@15/lib"
  export CPPFLAGS="-I/usr/local/opt/postgresql@15/include"

For pkg-config to find postgresql@15 you may need to set:
  export PKG_CONFIG_PATH="/usr/local/opt/postgresql@15/lib/pkgconfig"

To start postgresql@15 now and restart at login:
  brew services start postgresql@15
Or, if you don't want/need a background service you can just run:
  LC_ALL="C" /usr/local/opt/postgresql@15/bin/postgres -D /usr/local/var/postgresql@15
douglasmckinley@Douglass-MacBook-Pro ~ % 
```
It looks like you have installed PostgreSQL 15 using Homebrew, and it has provided some additional instructions on how to manage it.

Here’s a breakdown of what you might want to do next:

1. **Add PostgreSQL 15 to your PATH**:
   This will make sure PostgreSQL commands like `psql` and `pg_ctl` will use version 15 by default.
   
   Run the following command to add PostgreSQL 15 to your `PATH`:
   
   ```bash
   echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Set environment variables for compilers**:
   If you need to compile software that links against PostgreSQL, you may need to set the `LDFLAGS` and `CPPFLAGS` environment variables:
   
   ```bash
   export LDFLAGS="-L/usr/local/opt/postgresql@15/lib"
   export CPPFLAGS="-I/usr/local/opt/postgresql@15/include"
   ```

3. **Set the `PKG_CONFIG_PATH`**:
   If you are using `pkg-config` to manage build dependencies, you might need to set this as well:
   
   ```bash
   export PKG_CONFIG_PATH="/usr/local/opt/postgresql@15/lib/pkgconfig"
   ```

4. **Start PostgreSQL 15**:
   To start PostgreSQL as a background service and have it restart on login, you can run:
   
   ```bash
   brew services start postgresql@15
   ```

   If you prefer to run PostgreSQL manually in the foreground, you can use the following command:
   
   ```bash
   LC_ALL="C" /usr/local/opt/postgresql@15/bin/postgres -D /usr/local/var/postgresql@15
   ```

5. **Creating and managing databases**:
   Now that PostgreSQL is set up, you can create and manage databases using the `psql` command-line tool.

   - To access the PostgreSQL shell:
     ```bash
     psql postgres
     ```

   - To create a new database:
     ```bash
     createdb mydatabase
     ```

Make sure to run `brew services start postgresql@15` if you want PostgreSQL to run in the background and restart automatically on reboot.

Let me know if you need help with any further steps!

It looks like you are trying to run the `createdb` command from within the `psql` shell, which doesn't work because `createdb` is an external command that should be run from your terminal, not from inside the PostgreSQL shell (`psql`).

Here’s how to proceed:

### To create a new database from the terminal:

1. **Exit the `psql` shell** by typing:
   ```sql
   \q
   ```

2. **Run the `createdb` command** from your terminal, not inside `psql`:
   ```bash
   createdb mydatabase
   ```

This should create the `mydatabase` database.

### Alternatively, if you're inside the `psql` shell, you can use the SQL command:

1. Inside `psql`, to create a database, run:
   ```sql
   CREATE DATABASE mydatabase;
   ```

This is the correct SQL syntax for creating a database from within the `psql` shell.

Let me know if you need further assistance!
douglasmckinley@Douglass-MacBook-Pro Downloads % psql -U newuser -d mydatabase

psql (15.8 (Homebrew))
Type "help" for help.

mydatabase=> \du
                                      List of roles
    Role name    |                         Attributes                         | Member of 
-----------------+------------------------------------------------------------+-----------
 douglasmckinley | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 newuser         | Create DB                                                  | {}


# ---------------------- going from EC2/RDS to Local with pg_dump

To copy an SQL table from an RDS instance to your local machine, you can use a combination of the following steps, assuming you are using PostgreSQL. The general idea is to export the table from the RDS instance and then import it into your local PostgreSQL database.

### Steps:

#### 1. **Export the table from RDS using `pg_dump`**
You can use the `pg_dump` utility to export the data from the RDS PostgreSQL instance. Replace the placeholders with your actual RDS endpoint and credentials.

```bash
pg_dump -h <RDS_ENDPOINT> -U <USERNAME> -d <DATABASE_NAME> -t <TABLE_NAME> -f /path/to/dumpfile.sql
```
```bash
pg_dump -h database-1.cluster-ro-cvu2u86aui5t.us-west-2.rds.amazonaws.com -U postgres -d seattlecars -t listings -f /home/ec2-user/seattlecars_listings.sql
```

Explanation:
- `-h`: Hostname (your RDS endpoint)
- `-U`: Username to connect to the database
- `-d`: Database name
- `-t`: Table name (the table you want to export)
- `-f`: Output file for the dump

Example:

```bash
pg_dump -h your-rds-endpoint.rds.amazonaws.com -U postgres -d yourdatabase -t yourtable -f ~/yourtable_dump.sql
```

This command will export the specified table to a file called `yourtable_dump.sql` on your local machine.

### 1.a Sometimes, dumping specific parts of the database or with certain settings might help resolve issues. You can re-run pg_dump with additional flags to ensure it’s capturing the data properly.

For example, you can try specifying --inserts to ensure that the SQL dump contains explicit INSERT commands for each row of data:

```bash
pg_dump -h database-1.cluster-ro-cvu2u86aui5t.us-west-2.rds.amazonaws.com -U postgres -d seattlecars -t listings --inserts -f /home/ec2-user/seattlecars_listings.sql
```
This will ensure the dump uses individual INSERT statements, which can sometimes avoid formatting issues during restoration.

#### 2. **Transfer the dump file to your local machine (if necessary)**
If you’re running the above command on an EC2 instance or any other remote environment, you will need to copy the dump file to your local machine using `scp` or a similar tool.

Example: (run from your local machine)

```bash
scp -i /path/to/your-key.pem ec2-user@your-ec2-public-ip:/path/to/dumpfile.sql ~/local/destination/
```
```bash
scp -i ~/Downloads/MyRobot.pem ec2-user@34.214.154.43:/home/ec2-user/seattlecars_listings.sql ~/Desktop/wheelswatcher_documents/seattlecars_listings.sql
```

### File is at Desktop/wheelswatcher_documents/seattlecars_listings.sql , 1.5GB

### 2.a debugging the transfer
Verify file encoding: Make sure that the file encoding is compatible with PostgreSQL. Use UTF-8 encoding if possible. You can check and convert the encoding with the following command:
```
iconv -f ISO-8859-1 -t UTF-8 ~/Desktop/wheelswatcher_documents/seattlecars_listings.sql > ~/Desktop/wheelswatcher_documents/converted_file.sql
```
Given that the SQL file was created using `pg_dump` and you're encountering issues with invalid commands when attempting to restore it, it suggests that there might have been some corruption during the transfer or that the file is not being correctly interpreted by `psql`. Let's try a few things to resolve this:

### 2.a.1. **Ensure the file is not corrupted**
   Before anything, let's verify if the file is intact and not corrupted during transfer. You can use a checksum (like `md5`) to compare the original file on the EC2 instance with the one on your local machine.

   On the **EC2 instance**:
   ```bash
   md5sum /home/ec2-user/seattlecars_listings.sql
   ```

   On your **local machine**:
   ```bash
   md5 ~/Desktop/wheelswatcher_documents/seattlecars_listings.sql
   ```

   The checksums should match. If they don't, the file got corrupted during transfer, and you'll need to transfer it again.


#### 3. **Import the table into your local PostgreSQL database**
Once you have the SQL dump file on your local machine, you can import it into your local PostgreSQL database using `psql`:

```bash
psql -U <LOCAL_USERNAME> -d <LOCAL_DATABASE> -f /path/to/dumpfile.sql
```

Example:

```bash
psql -U douglasmckinley -d mydatabase -f ~/Desktop/wheelswatcher_documents/seattlecars_listings.sql
```

This will import the table into your local PostgreSQL database.

#### 4. **Verifying the Data**
Once the table is imported, you can connect to your local PostgreSQL instance and verify that the table has been imported correctly:

```bash
psql -U <LOCAL_USERNAME> -d <LOCAL_DATABASE>
```

```sql
SELECT * FROM <TABLE_NAME>;
```

This will display the data from the table you imported.

### Additional Notes:
- If the table schema is very large, you might want to use compression when transferring the file.
- Ensure your local PostgreSQL instance version is compatible with the version running on RDS to avoid compatibility issues.
- Make sure the `pg_dump` and `psql` commands are installed on your machine. You can install them via the PostgreSQL client tools if they aren't available.

Let me know if you need further details or adjustments for your specific setup!