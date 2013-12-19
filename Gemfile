source 'https://rubygems.org'

gem 'rails', '4.0.0'
gem 'thin'
gem 'nokogiri'
gem 'actionmailer'
gem 'paperclip'
gem 'twilio-ruby'
gem 'sass-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'stripe', :git => 'https://github.com/stripe/stripe-ruby'
gem 'sidekiq'
gem 'pg'
gem 'kaminari'



gem 'jquery-rails'

gem 'turbolinks'
gem 'jquery-turbolinks'
gem 'jbuilder', '~> 1.2'

gem 'bcrypt-ruby', '~> 3.0.0'

gem 'newrelic_rpm'

gem 'i18n', github: 'svenfuchs/i18n'

gem 'haml'

gem 'dalli'

group :doc do
  gem 'sdoc', require: false
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :development, :test do
  gem 'jazz_hands'
  gem 'rspec-sidekiq'
  gem 'factory_girl_rails'
  gem 'rspec-rails'
  gem 'capybara'
  gem 'poltergeist'
  gem 'selenium-webdriver'
  gem 'launchy'
  gem 'rack_session_access'
end

group :test do
  gem 'guard'
  gem 'guard-minitest'
  gem 'guard-rspec', require: false
  gem 'guard-rspec'
  gem 'simplecov', :require => false, :group => :test
  gem 'database_cleaner'
end 
group :production do
  gem 'rails_12factor'
  gem 'memcachier'
end
