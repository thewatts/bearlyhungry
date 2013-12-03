require './test/test_helper'

class OrderTest < ActiveSupport::TestCase

  test "it responds to #items" do
    assert_respond_to FactoryGirl.create(:order), :items
  end

  test "it responds to #order_items" do
    assert_respond_to FactoryGirl.create(:order), :order_items
  end

  test "it responds to #user" do
    assert_respond_to FactoryGirl.create(:order), :user
  end

  test "order valid with status" do
    order = FactoryGirl.build(:order, status: "pending")
    assert order.save
  end

  test "order invalid without status" do
    order = FactoryGirl.build(:order, status: "")
    refute order.save
    refute order.valid?
  end

  test "finds completed orders" do
    order1 = FactoryGirl.create(:order)
    order2 = FactoryGirl.create(:order, status: "completed")
    order3 = FactoryGirl.create(:order, status: "in_progress")
    order4 = FactoryGirl.create(:order, status: "completed")
    assert_equal [order2, order4], Order.completed
  end

  test "finds count by status" do
    order1 = FactoryGirl.create(:order)
    order2 = FactoryGirl.create(:order, status: "completed")
    order3 = FactoryGirl.create(:order, status: "in_progress")
    order4 = FactoryGirl.create(:order, status: "completed")
    order5 = FactoryGirl.create(:order, status: "cancelled")
    expected_output = {
      "pending" => 1, "completed" => 2, "in_progress" => 1, "cancelled" => 1
    }
    assert_equal expected_output, Order.count_by_status
  end

  test "groups by status" do
    order1 = FactoryGirl.create(:order)
    order2 = FactoryGirl.create(:order, status: "completed")
    order3 = FactoryGirl.create(:order, status: "in_progress")
    order4 = FactoryGirl.create(:order, status: "completed")
    order5 = FactoryGirl.create(:order, status: "cancelled")
    expected_output = {
      "pending"     => [order1],
      "completed"   => [order2, order4],
      "in_progress" => [order3],
      "cancelled"   => [order5]
    }
    assert_equal expected_output, Order.by_status
  end

  test "get all orders with a user id" do
    order1 = FactoryGirl.create(:order, user_id: 1)
    order2 = FactoryGirl.create(:order, user_id: 2)
    order3 = FactoryGirl.create(:order, user_id: "")
    order4 = FactoryGirl.create(:order, user_id: 1)
    order5 = FactoryGirl.create(:order, user_id: "")
    assert_equal [order1, order2, order4], Order.user_orders
  end

  test "adds a user to itself, and updates status to in progress" do
    order = FactoryGirl.create(:order, user_id: nil)
    user = FactoryGirl.create(:user)
    order.add_user(user)
    assert_equal "in progress", order.status
    assert_equal user.id, order.user_id
  end

end
