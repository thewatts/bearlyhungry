ENV["RAILS_ENV"] ||= "test"
require File.expand_path('../../config/environment', __FILE__)

if defined? Zeus
  require 'minitest/unit'
  MiniTest::Unit.class_variable_set('@@installed_at_exit', true)
end

require 'rails/test_help'
require 'minitest/pride'

class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
