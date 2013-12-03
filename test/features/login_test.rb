require './test/test_helper'
require 'pry'

class UserLoginTest < ActionController::TestCase

  setup do
    Capybara.reset_sessions!
    User.create!(
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
      full_name: "Example User"
    )
  end

   test "a user can login with correct info" do
     page.visit root_path
     fill_in "login-email",    with: "test@example.com"
     fill_in "login-password", with: "password"
     click_on "login-submit"
     assert_equal menu_path, page.current_path
   end

   test "a user can't login with incorrect info" do
     page.visit root_path
     fill_in "login-email",    with: "test@example.com"
     fill_in "login-password", with: "INCORRECT"
     click_on "login-submit"
     assert_equal root_path, page.current_path
   end

end
