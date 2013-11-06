require './test/test_helper'

class ItemCreationTest < ActionController::TestCase

  test "it creates an item with title, description and price" do
    visit items_path

    click_on "New Item"

    fill_in "title", :with => "Phonatic"
    fill_in "description", :with => "The best soup in town"
    fill_in "price", :with => 10.00

    click_on "Save Item"

    within("#items") do
      assert page.has_content?("Phonatic")
      assert page.has_content?("The best soup in town")
    end

  end

end
