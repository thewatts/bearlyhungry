require './test/test_helper'

class AddItemToOrderTest < ActionController::TestCase

  test "it adds an item to an order" do
    create_item
    visit items_path

    click_on "Add to Order"

    visit order_path

    within("#items") do
      assert page.has_content?("Phonatic")
      assert page.has_content?("The best soup in town")
    end

  end

  def create_item
    visit items_path

    click_on "New Item"

    fill_in "title", :with => "Phonatic"
    fill_in "description", :with => "The best soup in town"
    fill_in "price", :with => 10.00

    click_on "Save Item"
  end

end
