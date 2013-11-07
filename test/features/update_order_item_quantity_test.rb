require './test/test_helper'

class UpdateOrderItemQuantityTest < ActionController::TestCase

  test "it updates the quantity of an item in an order" do
    create_items

    visit order_path

    assert_equal 1, Item.first.id

    within "#items_for_order}" do
      click_on "Add to Order"
    end

    within "##{Item.last.id}" do
      click_on "Add to Order"
    end

    visit order_path

    within("#items_for_order") do
      assert page.has_content?("Phonatic")
      assert page.has_content?("The best soup in town")
      assert page.has_content?("$10.00")
      assert page.has_content?("Phonominal")
      assert page.has_content?("The better soup in town")
      assert page.has_content?("$20.00")
    end
  end

end
