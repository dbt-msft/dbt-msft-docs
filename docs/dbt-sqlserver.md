---
sidebar_position: 1
---

# dbt-sqlserver
[dbt](https://www.getdbt.com) adapter for sql server.

Passing all tests in [dbt-integration-tests](https://github.com/fishtown-analytics/dbt-integration-tests/). 

Only supports dbt 0.14 and newer!
- For dbt 0.18.x use dbt-sqlserver 0.18.x
- dbt 0.17.x is unsupported
- dbt 0.16.x is unsupported
- For dbt 0.15.x use dbt-sqlserver 0.15.x
- For dbt 0.14.x use dbt-sqlserver 0.14.x


Easiest install is to use pip:

    pip install dbt-sqlserver

On Ubuntu make sure you have the ODBC header files before installing

```
sudo apt install unixodbc-dev
```

## Authentication

The following is needed for every target definition for both SQL Server and Azure SQL.  The sections below details how to connect to SQL Server and Azure SQL specifically.
```
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
```

### Security
Encryption is not enabled by default, unless you specify it.

To enable encryption, add the following to your target definition. This is the default encryption strategy recommended by MSFT. For more information see [this docs page](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/connection-string-syntax#using-trustservercertificate?WT.mc_id=DP-MVP-5003930)
```yaml
encrypt: true # adds "Encrypt=Yes" to connection string
trust_cert: false
```
For a fully-secure, encrypted connection, you must enable `trust_cert: false` because `"TrustServerCertificate=Yes"` is default for `dbt-sqlserver` in order to not break already defined targets. 

### standard SQL Server authentication
SQL Server credentials are supported for on-prem as well as cloud, and it is the default authentication method for `dbt-sqlsever`
```
user: username
password: password
```
### Windows Authentication (SQL Server-specific)

```
windows_login: True
```
alternatively
```
trusted_connection: True
```
### Azure SQL-specific auth
The following [`pyodbc`-supported ActiveDirectory methods](https://docs.microsoft.com/en-us/sql/connect/odbc/using-azure-active-directory?view=sql-server-ver15#new-andor-modified-dsn-and-connection-string-keywords) are available to authenticate to Azure SQL:
- Azure CLI
- ActiveDirectory Password
- ActiveDirectory Interactive
- ActiveDirectory Integrated
- Service Principal (a.k.a. AAD Application)
- ~~ActiveDirectory MSI~~ (not implemented)

However, the Azure CLI is the ideal way to authenticate instead of using the built-in ODBC ActiveDirectory methods, for reasons detailed below.

#### Azure CLI
Use the authentication of the Azure command line interface (CLI). First, [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), then, log in:

```bash
az login
```

Then, set `authentication` in `profiles.yml` to `CLI`:

```
authentication: CLI
```

This is also the preferred route for using a service principal:

```
az login --service-principal --username $CLIENTID --password $SECRET --tenant $TENANTID
```

This avoids storing a secret as plain text in `profiles.yml`.

Source: https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli#sign-in-using-a-service-principal

#### ActiveDirectory Password 
Definitely not ideal, but available
```
authentication: ActiveDirectoryPassword
user: bill.gates@microsoft.com
password: i<3opensource?
```
#### ActiveDirectory Interactive (*Windows only*)
brings up the Azure AD prompt so you can MFA if need be. The downside to this approach is that you must log in each time you run a dbt command!
```
authentication: ActiveDirectoryInteractive
user: bill.gates@microsoft.com
```
#### ActiveDirectory Integrated (*Windows only*)
uses your machine's credentials (might be disabled by your AAD admins), also requires that you have Active Directory Federation Services (ADFS) installed and running, which is only the case if you have an on-prem Active Directory linked to your Azure AD... 
```
authentication: ActiveDirectoryIntegrated
```
##### Service Principal
`client_*` and `app_*` can be used interchangeably. Again, it is not recommended to store a service principal secret in plain text in your `dbt_profile.yml`. The CLI auth method is preferred.
```
authentication: ServicePrincipal
tenant_id: tenatid
client_id: clientid
client_secret: clientsecret
```


## Supported features

### Materializations
- Table: 
    - Will be materialized as columns store index by default (requires SQL Server 2017 as least). 
      (For Azure SQL requires Service Tier greater than S2)
    To override:
{{
  config(
    as_columnstore = false,
  )
}}
- View
- Incremental
- Ephemeral

### Seeds

By default, dbt-sqlserver will attempt to insert seed files in batches of 400 rows. If this exceeds SQL Server's 2100 parameter limit, the adapter will automatically limit to the highest safe value possible.

To set a different default seed value, you can set the variable `max_batch_size` in your project configuration.

```yaml
vars:
  max_batch_size: 200 # Any integer less than  or equal to 2100 will do.
```

### Hooks

### Custom schemas

### Sources


### Testing & documentation
- Schema test supported
- Data tests supported from dbt 0.14.1
- Docs

### Snapshots
- Timestamp
- Check

But, columns in source table can not have any constraints. If for example any column has a NOT NULL constraint, an error will be thrown.

### DBT Utils
Many DBT utils macros are supported, but they require the addition of the `tsql_utils` dbt package. 

You can find the package and installation instructions in the [tsql-utils repo](https://github.com/dbt-msft/tsql-utils).

### Indexes
There is now possible to define a regular sql server index on a table. 
This is best used when the default clustered columnstore index materialisation is not suitable. 
One reason would be that you need a large table that usually is queried one row at a time.

Clusterad and non-clustered index are supported:
- create_clustered_index(columns, unique=False)
- create_nonclustered_index(columns, includes=False)
- drop_all_indexes_on_table(): Drops current indexex on a table. Only meaningfull if model is incremental.


Example of applying Unique clustered index on two columns, Ordinary index on one column, Ordinary index on one column with another column included

    {{
        config({
            "as_columnstore": false, 
            "materialized": 'table',
            "post-hook": [
                "{{ create_clustered_index(columns = ['row_id', 'row_id_complement'], unique=True) }}",
                "{{ create_nonclustered_index(columns = ['modified_date']) }}",
                "{{ create_nonclustered_index(columns = ['row_id'], includes = ['modified_date']) }}",
            ]
        })
    }}


## Changelog

See [the changelog](https://github.com/dbt-msft/dbt-sqlserver/blob/master/CHANGELOG.md)