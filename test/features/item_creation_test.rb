require 'test_helper'

class ItemCreationTest < ActionController::TestCase

  test "it creates an item with title, description and price" do
    # visit items page
    visit items_path
    # click "new item"
    click_on "New Item"
    # enter title
    fill_in "title", :with => "Phonatic"
    # # enter description
    fill_in "description", :with => "The best soup in town"
    # # enter price
    fill_in "price", :with => 10.00
    # # click "save item"
    click_on "Save Item"
    within("#items") do
      assert page.has_content?("Phonatic")
      assert page.has_content?("The best soup in town")
    end
  end

end
