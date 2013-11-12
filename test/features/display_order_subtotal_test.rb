require './test/test_helper'

class ItemCreationTest < ActionController::TestCase

  setup do
    Capybara.reset_sessions!
  end

  test "an order has a subtotal" do
    create_items

    add_items_to_cart

    visit order_path

    within '#order_subtotal' do
      assert page.has_content? ("$30.00")
    end


  end

  def add_items_to_cart

    visit items_path

    within "#item-1" do
      click_on "Add to Order"
    end

    within "#item-2" do
      click_on "Add to Order"
    end
  end

  def create_items
    visit items_path

    click_on "Create New Item"

    fill_in "title", :with => "Phonatic"
    fill_in "description", :with => "The best soup in town"
    fill_in "price", :with => 10.00

    click_on "Save Item"

    visit items_path

    click_on "Create New Item"

    fill_in "title", :with => "Phonominal!"
    fill_in "description", :with => "The better soup in town"
    fill_in "price", :with => 20.00

    click_on "Save Item"
  end
end
