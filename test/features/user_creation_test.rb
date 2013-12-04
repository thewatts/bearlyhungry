require './test/test_helper'

class UserCreationTest < ActionController::TestCase

  setup do
    Capybara.reset_sessions!
  end

   test "a user can create an account" do
     page.visit root_path
     refute page.has_content?("Logout")
     within '#signupTab' do
       fill_in "full-name",             with: "Test User"
       fill_in "email-address",         with: "test@example.com"
       fill_in "password",              with: "password"
       fill_in "password-confirmation", with: "password"
       click_on "signup-submit"
     end
     assert page.has_content?("Logout")
   end

end
