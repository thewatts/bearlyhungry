require './test/test_helper'

class CanAddItemsFromOldOrdersToCurrentOrderTest < ActiveSupport::TestCase

  setup do
    Capybara.reset_sessions!
    user = User.create!(
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
      full_name: "Example User"
    )
    @item1 = FactoryGirl.create(:item, title: "chicken")
    @item2 = FactoryGirl.create(:item, title: "noodles")

    @old_order = FactoryGirl.create(:order, user_id: user.id)
    @old_order.add_item(@item1.id, 10)
    @old_order.add_item(@item2.id, 5)
    login_user(user)
  end

  def login_user(user)
    page.visit root_path
    fill_in "login-email",    with: "test@example.com"
    fill_in "login-password", with: "password"
    click_on "login-submit"
  end


  test "a user can add items from past orders to their current order" do
    page.visit my_orders_path
    assert_equal my_orders_path, page.current_path
  end

end
