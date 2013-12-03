require './test/test_helper'
require 'pry'

class UserLogoutTest < ActionController::TestCase

  setup do
    Capybara.reset_sessions!
    User.create!(
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
      full_name: "Example User"
    )
    page.visit root_path
    fill_in "login-email",    with: "test@example.com"
    fill_in "login-password", with: "password"
    click_on "login-submit"
  end
   test "a user can logout" do
     page.visit menu_path
     click_on "Logout"
     refute page.has_content?("Account")
     assert page.has_content?("You have successfully logged out.")
     assert_equal root_path, page.current_path
   end

end
