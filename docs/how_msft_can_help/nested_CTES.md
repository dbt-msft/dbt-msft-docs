---
title: Nested CTES in TSQL, a treatise
sidebar_position: 2
---

#  Nesting queries with WITH clauses in TSQL, a treatise

## Background

### TL;DR

Allowing nested WITH statements (not in love with terminology, examples given below) would enable MSFT customers to fully take advantage of templating engines and their respective ecosystems. These templating engines are already very popular on non-MSFT database products.

Today in TSQL, the below example is not correct TSQL, but the following two are.

Our ask is to be able to do the first in TSQL


```sql
-- does not work
WITH goku_outer AS (
    WITH goku_inner AS (
        SELECT 9001 as power_level
    )
    SELECT * FROM goku_inner
)
SELECT * FROM goku_outer
```


```sql
-- works
WITH goku_inner AS (
    SELECT 9001 as power_level
),
goku_outer AS (
    SELECT * FROM goku_inner
)
SELECT * FROM goku_outer
```

```sql
-- works
SELECT * FROM (
  SELECT * FROM (
    SELECT 9001 as power_level
  ) random_required_alias1
) random_required_alias2;
```

## Example

The benefit of the first example above is that it allows easy query injection. Wrapping a select query in a CTE only works in TSQL today if the statement you are trying to wrap does not also have a CTE.


```sql
-- template statement
WITH goku_outer AS (
    <MY_SELECT_STATEMENT>
)
SELECT * FROM goku_outer
```

Say for example that `<MY_SELECT_STATEMENT>` is the below.

```sql
-- <MY_SELECT_STATEMENT>
WITH goku_inner AS (
    SELECT 9001 as power_level
)
```

The only way to inject this query is to *modify* the template to make the nested CTEs sequential before it works. So now the template becomes the below, but only if the <MY_SELECT_STATEMENT> contains a CTE?

```sql
-- template if <MY_SELECT_STATEMENT> contains a CTE

<MY_SELECT_STATEMENT>,
WITH goku_outer AS (
    SELECT * FROM goku_inner
)
SELECT * FROM goku_outer
```

IMHO, this is excessive and it makes query injection via templating needlessly difficult, especially given that both nested subqueries and sequentially nested CTEs are already supported.


## Reasons (ordered by ease of explanation)

### 1. Everyone else does it

The open-source data engineering ecosystem is growing at a breakneck speed -- especially tools that work with cloud data warehouses (e.g. [Airflow](https://airflow.apache.org/), [dbt](https://www.getdbt.com/), [SQLFluff](https://www.sqlfluff.com/), and [Great Expectations](https://greatexpectations.io/))

In order for databases to stay competitive, they need to facilitate easy integration with these tools, or risk getting left behind.

I understand the TSQL predates, 

The below table shows which databases support this convention.


| database          | support          |
|-------------------|--------------------|
| Postgres          | :white_check_mark: |
| AWS Redshift      | :white_check_mark: |
| Snowflake         | :white_check_mark: |
| Big Query         | :white_check_mark: |
| Spark SQL         | :white_check_mark: |
| SQL Server        | :x:                |
| Azure SQL         | :x:                |
| Azure Synapse SQL | :x:                |



### 2. Low-hanging, Syntactic Fruit

Both nested subqueries and sequentially nested CTEs are already supported, so IMO, it isn't a large amount of effor to support this.

```sql
WITH goku_outer AS (
    WITH goku_inner AS (
        SELECT 9001 as power_level
    )
    SELECT * FROM goku_inner
)
SELECT * FROM goku_outer
```

### 3. more flexibility with SQL templating engines

Quote from Jacob Matson ([@matsonj](https://github.com/matsonj)):

> Enabling "Nested CTEs" allows for an improved "application/human interface". Not for technical users, per se, but for analysts using 3rd party tools such as [dbt](https://www.getdbt.com/) but also for power users of TSQL applications. An advanced pattern in many tools (including at Simetric, where I work) is providing the capability for end-users to create single queries and then string them together in templates (lego blocks). This pattern is quite difficult in SQL Server because CTEs either cannot be used at all or the application developers must work around this capability gap. This makes the underlying queries more difficult for humans to read and therefor more difficult to debug. This also makes SQL Server less attractive as self-service analytics continue to evolve and power users continue to get closer to "raw SQL" inside their respective applications.

#### Background: Templating in HTML

[Flask](https://palletsprojects.com/p/flask/) is a popular Python web application framework. At it's core is Jinja, a Python-esque library that allows users to inject imperative logic into HTML, which has traditionally been declarative language.


Below is a trivial example of generating an HTML list with a Python list variable and Jinja, which uses curly brackets.

```html
<!-- BEFORE  -->
<!-- name = ['Foo', 'Bar', 'Qux'] -->
<ul>
{% for name in names %}
   <li>{{ name }}</li>
{% endfor %}
</ul>

<!-- AFTER  -->
<ul>
   <li>Foo</li>
   <li>Bar</li>
   <li>Qux</li>
</ul>
</ul>
```

#### Templating in SQL?

Templating is increasingly popular in data warehouse development. Some great use cases:
- parameterizing database names for deploying to multiple environments
- making repetitive, boilerplate SQL into something more observable
- model abstraction logic
- injecting dynamic SQL
- functional code chaining concepts

In fact, the magic of dbt is just Jinja templating. dbt goes one step further and templatizing your DDL statements like `CREATE TABLE AS` and `CREATE VIEW AS` allowing users to just focus on SELECT queries. ([to read more about the power of dbt](https://docs.getdbt.com/docs/introduction#what-makes-dbt-so-powerful))


If TSQL could allow wrapping arbitrary SELECT queries within a CTE, it would have the following effects on dbt custom adapter maintenance:
- dbt-sqlserver and dbt-synapse get the benefits of [ephemeral](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/materializations#ephemeral) materializations and dbt tests without extra work
- dbt-msft users can take advantage of community-supported adapters with more confidence (many package maintainers make heavy use of CTE-query-wrapping)****
