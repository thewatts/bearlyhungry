require 'test_helper'

class UserTest < ActiveSupport::TestCase

    test "users's current order" do
      user   = FactoryGirl.create(:user)
      order1 = FactoryGirl.create(:order, user_id: user.id)
      order2 = FactoryGirl.create(:order, user_id: user.id)

      assert_equal order2, user.current_order
    end

    test "user's past orders" do
      user   = FactoryGirl.create(:user)
      order1 = FactoryGirl.create(:order, user_id: user.id)
      order2 = FactoryGirl.create(:order, user_id: user.id)
      order3 = FactoryGirl.create(:order, user_id: user.id)
      desired_result = [order3, order2, order1]

      assert_equal desired_result, user.past_orders
    end

    test "user's total spent" do
      user   = FactoryGirl.create(:user)
      item1  = FactoryGirl.create(:item, title: "item1", price: 5.00)
      item2  = FactoryGirl.create(:item, title: "item2", price: 10.00)
      item3  = FactoryGirl.create(:item, title: "item3", price: 12.00)
      order1 = FactoryGirl.create(:order, status: "completed", user_id: user.id)
      order2 = FactoryGirl.create(:order, status: "completed", user_id: user.id)
      order3 = FactoryGirl.create(:order, status: "completed", user_id: user.id)

      order1.add_item(item1, 10)
      order2.add_item(item1, 5)
      order2.add_item(item2, 5)
      order3.add_item(item3, 10)

      assert_equal 245.00, user.total_spent
    end


end
