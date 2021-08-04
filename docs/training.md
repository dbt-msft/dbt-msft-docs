---
title: dbt Training Crash Course
sidebar_position: 1
---


# Avanade Training!

Very humbled to have you all here to check out what we've been working on these past few months. Hopefully y'all will think it is as cool and useful as we have!

This is a shortened version of the FIRST official training, so apologies for where the training could be rough around the edges. This version focuses on demonstrating how to **(1)** set up your environment, **(2)** connect your dbt project to a database, and **(3)** create some models with the dbt framework. There are some success stories already in that we now have four people on the team that know dbt (3 of whom are here today to help out and learn more).

## Table of Contents

0. Download & Install Software
1. Environment Set Up (30 min)
2. Learn dbt commands & create models
3. Exercises
4. Additional Resources
3. dbt+msft scope


## 0. Download & Install Software

Ahead of the call if you could please download and install the following (if you haven’t already):

- [Anaconda](https://www.anaconda.com/products/individual)
- [Microsoft ODBC Driver 17](https://www.microsoft.com/en-us/download/details.aspx?id=56567)
- [VSCode](https://code.visualstudio.com/Download)
- [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver15) and/or [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15)
<!-- - [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) -->


## 1. Environment Set Up

This is the biggest hurdle to using dbt right now. IMHO, it isn't that big. Fishtown Analytics has a web-based IDE tool that you'll see being used in the training course. The advantage is that you can write dbt models and run them in the same window.

There may be an issue where your terminal can't find Git or Anaconda, in which case we made need to add to your system environment's PATH variable.

Here we'll be using a version of the same repo that Fishtown uses for their training.

### VSCode

1. Clone [this repo](https://github.com/chaerinlee1/jaffle_shop) in VSCode
   1. Open VSCode and type (`CTRL + Shift + P`) to access the command palette located at the top.
   2. Type `git: clone` and select the option.
   3. Paste the git URL: `https://github.com/chaerinlee1/jaffle_shop` and hit enter.
   4. Choose which folder you want your code to go in and click "Select Repository Location". I typically have all my repositories in `C:\Code`.
   6. A pop up message should appear on the lower right of VSCode asking if you would like to open the cloned repository. Click "Open".
   6. Go to the dbt_crash_course branch by clicking on the bottom left button on the window (it should say main or master) and choosing the dbt_crash_course branch.
2. After cloning, you should be prompted to install some extensions -- you should! Click on the 5th icon from the top in the left window pane. Or use the shortcut (`CTRL + SHIFT + X`). Type in the following extensions in the search bar and install:
   * `python extension`
   * `better jinja`
   * `vscode-dbt`
   * `rainbow csv`
3. Create a new branch from the main branch by clicking on the bottom left button on the blue ribbon of VSCode (it should probably say "main"). Then click on "Create new branch from...". Name your branch (maybe to your initials e.g. "cl_dbttraining") and hit Enter. Click on "origin/main".
3. Now we need to set up `profiles.yml` to connect to our database.
   1. Create new directory called `.dbt` under your user folder (`C:\Users\your_user_folder`).
   2. Add the `.dbt` folder to your workspace in VSCode by clicking on File -> Add  Folder to Workspace... -> your new `.dbt` folder -> Add.
   3. Create a new file into the new folder by right clicking the folder and clicking on New File. Name the file `profiles.yml`.DF
   4. Go to the new file and paste the following code below. Edit the `schema` field to your initials or anything that serves as an identifier for your work. Then save your changes! (`CTRL + S`)
   
	```jsx title="profiles.yml"
	jaffle_shop:
			target: dev
			outputs:
				dev:
				type: sqlserver
				driver: "ODBC Driver 17 for SQL Server"
				schema: cl
				host: its-data-mart-dev-server.database.windows.net
				database: Marketing_Dev
				authentication: CLI
	```
4. Create your conda environment and install the necessary packages. The good thing is that you can reuse this environment for future dbt work and this is only a one-time process.
   1. Open a new terminal with the shortcut `` CTRL + SHIFT + ` ``.
   2. Click "Allow" when a pop up appears asking if you allow the workspace to modify your terminal shell.
      * If you see "PS" next to your current directory on the command line, that means you're using powershell and we don't want to use that. The fix: open a new terminal again and you should now be using cmd.
   3. Since you already installed Anaconda, you should see `conda activate base` run automatically and (base) should be next to your current directory.
   4. Create a new, empty environment by running `conda create -n dbtenv python=3.7.9`. The name of your environment is `dbtenv` and we are using Python version 3.7.9. Type `y` then `Enter` when the command line asks to proceed.
   5. Run `conda activate dbtenv` in the command line to activate your new environment.
   5. Install the following packages:
      * Run `pip install dbt-sqlserver`
      * Run `pip install azure-cli==2.21.0`
5. Log into Azure. We want to connect to the database via Azure CLI.
   1. Run `az login`
   2. In the window that popped up, sign in with your Avanade credentials. Once signed, in you can close out of that window. If the window says that an error occurred and is directing you to a localhost url, you can try logging in using `az login --use-device-code`. This will provide you instructions to go to a general url and paste in the code provided on the command line.
   3. If you belong to multiple subscriptions, you must specify the subscription by running `az account set --subscription ff2e23ae-7d7c-4cbd-99b8-116bb94dca6e`. This is the ID for AzureCloud.
6. Let's verify that we can connect to the database successfully.
   1. Run `dbt debug`. This command tries to connect to the database using the parameters from `profiles.yml` and `dbt_project.yml`.
      * You connected successfully if you see all green and no error messages!

### Azure Data Studio or SSMS

1. Last step in the set-up is to log in to the database. **Below are instructions for Azure Data Studio, but if you're receving an error message you can try on SQL Server Management Studio (SSMS) too. Instructions are very similar!**
   1. Open Azure Data Studio and click on the first icon on the left side panel called "Connections".
   2. Click "Add Connection" and paste in the connection info below in the relevant fields. This info can also be found in `profiles.yml`
      * Server: its-data-mart-dev-server.database.windows.net
      * Authentication type: Azure Active Directory
      * Account: Click the drop down menu, if you don't see your Avanade email then click "Add an account" and sign in like before
      * Azure AD tenant: Avanade
      * Database: Manually type "Marketing_Dev"
   3. Click Connect
      1. You are now connected to the database! 
         * Note that there are tables in the database already. These are other people's tables that they created using their schema name. Yours will start to show up as you start creating your dbt models.
2. If you are not familiar with Azure Data Studio/SSMS, here are some pro tips that might be useful when going through the exercises. Otherwise, you can start on the exercises in the next section below!
   1. The server you are connected to as well as the **Tables** and **Views** folders are both located on the left side of the page
      1. **To quickly query a table or view**: Go into the relevant folder, right click the name, and click "Select Top 1000".
      2. **To write a new query**: Right click the server, and click "New Query"
   3. If you're wondering why you're not seeing your tables/views show up after running dbt commands in VSCode, you can right click on the **Tables** or **Views** folder and click "Refresh".
      * You can also do this to the server itself as well, but this might take longer.


## 2. Learn dbt commands and create models

Try the walk-through tutorial of using dbt below as well as some exercises for you to try on your own. There are also additional resources found at the end of this section. Happy modeling!

### Tutorial

#### 0. Get your raw tables in the database

Usually when building a data warehouse, you would connect to an external data source where the raw tables live and bring those tables into the dbt workspace to do your transormations. For the purpose of a (hopefully) simpler tutorial on understanding the basic dbt commands and framework, we will be using seeds.

These seeds are located under `jaffle_shop\data`. **You might be wondering: What are seeds?** They are CSV files that contain static data meaning they change infrequently. A typical use-case for seeds is a list of mappings of country codes to country names. This is why you would normally connect to an external data source for raw files that get updated often, but that can be a dbt crash course session for some other time :smiley:. 

1. Let's load the CSV files into our data warehouse. Run `dbt seed` in the command line.
   * Once you've gotten the green "Completed Successfully" message, you can view the tables you just materialized in Azure Data Studio or SSMS. They are generated as **Tables** and can be found in the **Tables** folder with your schema in the name. You should see 3 tables get generated: `raw_customers`, `raw_orders`, and `raw_payments`

#### 1. Create models

There are 3 different checkpoints for models in the dbt framework, listed below. To read more on how dbt projects are structured, check out this [article](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355) by Claire Carroll, dbt Community Manager.
* **Sources** - raw data, i.e. the tables we created in the previous step
* **Staging Models** - used for renaming columns, recasting, or any other transformations needed in order for the model to be in a consistent format; created from **sources** and have a 1:1 relationship with their respective source table
* **Marts Models** - contains all necessary business logic with more complex transformations (joins, window functions, etc); created from **staging models**

Let's make some dbt models! The following steps will show the journey line of how `customers` and `orders`, two marts models, get created and transformed from their raw data sources. 

1. **Create the Staging Models layer**: The SQL files that create these tables are located in `models\staging`. Take a quick look at the code or each of the files to understand the transformations being done. You'll notice that the transformations are mostly just renaming and conversions. This is important to maintain consistency and clarity since these tables will serve as the building blocks of more complex tables. Additionally, it is common to see multiple staging layers in a dbt project if there is a more complex business need, however in this example only 1 layer is necessary. In the command line, individually run:
   1. `dbt run --model stg_customers`
   2. `dbt run --model stg_orders`
   3. `dbt run --model stg_payments`
   4. Do "Select Top 1000" for each of the tables you just created in Azure Data Studio or SSMS and take a look at these tables. These can be found under **Views** as `your_schema_name.stg_customers` and so on.
   5. Take a look at the compiled SQL code for each of these tables in `target\compiled\jaffle_shop\models\staging`. This is the SQL code that's being done in the background of our dbt commands, i.e. this is the code that materializes our models in Azure Data Studio or SSMS. When you come across an error, it's helpful to paste and run the compiled code in Azure Data Studio or SSMS to help you debug any issues in your code quicker.
3. **Create the Marts Models layer**: The SQL code for these tables can be found in the `models` directory as `customers.sql` and `orders.sql`.
   1. Run `dbt run --model customers`
      * Take a look at the code in the file and try to understand the transformations happening and the tables being used to create this table. You can paste and run parts of the compiled code, located in `target\compiled\jaffle_shop\models`, in Azure Data Studio or SSMS to understand the code piece by piece. You'll notice that there are several CTE's in this file, each serving a different purpose, with more complex functions and joins.
   2. Run `dbt run --model orders`
      * Follow the same steps as the previous model. You will notice some Jinja code in this fiile. Jinja is a web template engine for Python and allows you to do for loops, like in this example, which is helpful to shorten repetitive code that can take up several lines in your code base - pretty powerful stuff! Alieu will go more in depth on Jinja in a later session!
   2. Do "Select Top 1000" on the `customers` and `orders` tables in Azure Data Studio or SSMS under **Tables** and take a look at these tables.
   3. *Note: If you're wondering what dictates whether a dbt model gets turned into a table or view, check out `dbt_project.yml`. You can see on lines 21-27 that we can choose which which SQL files will get materialized to a table or view at the model level. In our case, we set all the files in the `staging` folder to be views, and the rest as tables.*
4. Congrats! You finished creating your first dbt project! :tada:
   1. Run `dbt run`. Without the model parameter like in previous examples, this allows **all** the SQL files under the `models` folder to get materialized in SQL Server. Now, `customers` and `orders` are both materialized with one command, along with their parent tables.

## 3. Exercises

Now that you have a basic understanding of how to create models, lets make some on your own while flexing your SQL muscles!

Create models that solve each of the following scenarios. For each of the models, create a new SQL file by right clicking the `models` directory and giving each a relevant name.

1. Which payment method was the most popular in March 2018, and who are those people that used that payment method during that time?
2. Seed to marts model exercise:
   1. I made a CSV file that contains the item of each transaction made at the Jaffle Shop. Take the CSV file from the chat or [here](/data/training/item.csv) and drag it into the `data` directory, where all the other seeds are. Load the seed file into the dbt project like we did previously.
   2. For the staging table, rename the "id" column to "item_id" and make the "jaffle_type" column all lower case.
   3. Create a model that shows what the most popular jaffle was in each month.
5. The `customers` table contains quite a few CTEs. Can you break up that file into multiple files so that there is 1 CTE containing transformations per file? I'm picturing 3 total files. For more information on the use of CTE's in dbt projects, check out [this section](https://docs.getdbt.com/docs/guides/best-practices#break-complex-models-up-into-smaller-pieces) of the dbt best practices page.
2. What were the most recent dates of each order status? Order the results by date.
4. On average, how much does each customer spend per order? Please show the first name and last name initial in one column and order it by that column alphabetically.

## 4. Additional Resources

- [Claire's classic text + video walkthrough](https://docs.getdbt.com/tutorial/setting-up) - check this out if you want to learn how to set up and deploy a dbt project using BigQuery (flip through the modules under "Getting Started" on the left)
- [Kyle's amazing course](https://courses.getdbt.com) - this course shows you how to use dbt cloud and goes over some fundamental concepts around dbt
- [thorough docs worth going through](https://docs.getdbt.com/docs/building-a-dbt-project/projects) - these are great overviews about modeling, testing, documentation, sources, and other additional topics we did not cover (flip through the topics under "Building a dbt Project" on the left)


## 5. dbt+msft better together

- [the dbt viewpoint](https://docs.getdbt.com/docs/about/viewpoint)
- [dbt-utils](https://github.com/fishtown-analytics/dbt-utils)
- production workflow