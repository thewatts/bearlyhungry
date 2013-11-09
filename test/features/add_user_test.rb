require './test/test_helper'

class AddUserTest < ActionController::TestCase

  test "it can add a user" do
    visit items_path

    click_on "Sign Up"


  end

end
