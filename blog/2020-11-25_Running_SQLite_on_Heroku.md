# (Not) Running SQLite on Heroku

[SQLite](https://sqlite.org/index.html) is a tiny (716 kB!) open-source relational database in a library.
It's easy to install and run, and is sufficient for most small use cases that want to store data in a structured format.

In particular, the web framework Ruby on Rails uses SQLite3 as the [development database by default](https://guides.rubyonrails.org/getting_started.html#installing-sqlite3). This allows storing models in relational database tables without having to run a full-fledged db such as Postgres or MySQL on the development machine.

**So, to keep complexity as low as possible, I decided it might be a good idea to also run SQLite in the deployed version of a new, fairly simple Rails application. This had a few downsides.**

The good new first: The approach works well on the development machine (`RAILS_ENV=production rails server`), the required `database.yml` is very compact and concise:

```yml
default: &default
  adapter: sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: db/development.sqlite3

test:
  <<: *default
  database: db/test.sqlite3

production:
  <<: *default
  database: db/production.sqlite3
```

If you have full control of your deployment environment this approach would work well.
However, we do not, as we want to use [Heroku](https://heroku.com/), a managed platform as a service provider with support for Rails.
When running this configuration on Heroku, you end up with the following error messages when trying to install the required `sqlite3` gem dependency (from [here](https://github.com/hpi-swt2/connections-portal/runs/1448516309?check_suite_focus=true#step:3:171)):


```
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.
checking for sqlite3.h... no
sqlite3.h is missing. Try 'brew install sqlite3', 'yum install sqlite-devel' or 'apt-get install libsqlite3-dev' and check your shared library search path (the location where your sqlite3 shared library is located).
```

and

```
An error occurred while installing sqlite3 (1.4.2), and Bundler cannot continue.
Make sure that `gem install sqlite3 -v '1.4.2' --source 'https://rubygems.org/'` succeeds before bundling.
```

To solve this issue, we would need to install the required package on the server. 
However, Heroku offers only limited configuration options, stating in their [help resources](https://help.heroku.com/IYRYW6VB/how-do-i-install-additional-software-packages-that-my-application-requires):

> We don't offer official support for installing extra packages but there are a couple of unsupported options.

Furthermore, there are other downsides for using SQLite in Heroku instances. In fact, Heroku has an [entire article](https://devcenter.heroku.com/articles/sqlite3) dedicated to the topic.

Summarizing the main points of why not to use SQLite on Heroku:

* **The contents of Heroku container filesystems is periodically cleared**, i.e. they use an [ephemeral fileystem](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem). As SQLite stores data in the filesystem, this would lead to a complete data loss at least every 24 hours.
* **Disks of Heroku containers are not synchronized**, so if you use multiple of them to scale the application, they would have different sets of data.

Instead, Heroku suggests using the PostgreSQL database in production and provides [configuration steps](https://devcenter.heroku.com/articles/sqlite3#running-rails-on-postgres) for Ruby on Rails applications.

However, should you want to use a dependency in your application that internally relies on SQLite (check using `grep "sqlite" Gemfile.lock`), Heroku simply suggests:

> Find the gem that has sqlite3 as a dependency and remove it from your Gemfile

Alternatively, deploying and running in a [Docker container on Heroku](https://devcenter.heroku.com/articles/container-registry-and-runtime) could be a solution.


## Summary

Q: *Should you run SQLite on Heroku to simplify your tech Ruby on Rails tech stack?*

A: No, the default Heroku configuration is not a good fit for it. Use PostgreSQL (and the [`pg` gem](https://github.com/ged/ruby-pg)) instead.