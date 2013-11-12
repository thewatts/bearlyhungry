require './test/test_helper'

class AddUserTest < ActionController::TestCase

  test "it can add a user" do
    visit items_path

    click_on "Sign Up"
    fill_in "full_name", :with => "Pho King"
    fill_in "display_name", :with => "Phoking"
    fill_in "email", :with => "phoking@sob.com"
    fill_in "password", :with => "password"
    fill_in "password_confirmation", :with => "password"

    click_on "Save Your Account"

  end

end
