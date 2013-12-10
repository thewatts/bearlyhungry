require './test/test_helper'

class AddUserTest < ActionController::TestCase

  test "it can add a user" do
    visit menu_path

    within('#exampleModal') do
      click_on "Signup"

      fill_in "full_name", :with => "Pho King"
      fill_in "display_name", :with => "Phoking"
      fill_in "email", :with => "phoking@sob.com"
      fill_in "password", :with => "password"
      fill_in "password-confirmation", :with => "password"

    click_on "Signup!"
    end

  end

end
