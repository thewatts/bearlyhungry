require './test/features/test_helper'

# class AddItemToOrderTest < FeatureTest
class AddItemToOrderTest < ActionController::TestCase

  setup do
    Capybara.reset_sessions!
  end

  test "it adds an item to an order" do
    first_item = create_item("Phonatic","The best soup in town",10.00)
    second_item = create_item("Phonominal!","The better soup in town",20.00)

    visit items_path

    # within dom_id(first_item) do
    within "#item-1" do
      click_on "Add to Order"
    end

    within "#item-2" do
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

  # if we are sub-class of FeatureTest we don't need this
  # include WTPhoFeatureHelpers

  # test_helper.rb local to feature
  def create_item(title,description,price)
    visit items_path

    click_on "New Item"

    fill_in "title", :with => title
    fill_in "description", :with => description
    fill_in "price", :with => price

    click_on "Save Item"

    # NOTE: this might not work because most tests run in a transaction
    # Idea.last
    # OR
    # Find the last item just add to the index
  end

  # test_helper.rb
  def dom_id(model)
    "##{model.class.name.downcase}-#{model.id}"
  end

end
