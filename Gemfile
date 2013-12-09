source 'https://rubygems.org'

gem 'rails', '4.0.0'
gem 'thin'
gem 'nokogiri'
gem 'actionmailer'
gem 'font-awesome-rails'
gem 'twilio-ruby'
gem 'seed_dump'
gem 'aws-sdk'
gem 'asset_sync'
gem 'faker'
gem 'resque', '~> 1.22.0'
gem 'redis-store', '~> 1.0.0'
gem 'kaminari'
gem 'newrelic_rpm'

gem 'sass-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'jquery-rails'
gem 'zurb-foundation', '~> 4.3.2'
gem 'paperclip'
# gem 'therubyracer', platforms: :ruby

gem 'stripe', :git => 'https://github.com/stripe/stripe-ruby'

gem 'turbolinks'
gem 'jquery-turbolinks'
gem 'jbuilder', '~> 1.2'
gem 'bcrypt-ruby', '~> 3.0.0'

group :production do
  gem 'pg'
  gem 'rails_12factor'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :development, :test do
  gem 'jazz_hands'
  gem 'factory_girl_rails'
  gem 'rspec-rails'
  gem 'zeus'
  gem 'capybara'
  gem 'sqlite3'
end

group :test do
  gem 'guard'
  gem 'guard-minitest'
  gem 'guard-rspec', require: false
  gem 'guard-rspec'
  gem 'simplecov'
end

group :doc do
  gem 'sdoc', require: false
end

# Use unicorn as the app server
# gem 'unicorn'
# Use Capistrano for deployment
# gem 'capistrano', group: :development
# gem 'debugger', group: [:development, :test]
# Ruby Version for Heroku
ruby "2.0.0"
