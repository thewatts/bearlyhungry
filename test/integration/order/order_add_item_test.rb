require './test/test_helper'

class OrderTest < ActiveSupport::TestCase

  test "adding items adds items to order" do
    order  = FactoryGirl.create(:order)
    item1  = FactoryGirl.create(:item, title: "item1")
    item2  = FactoryGirl.create(:item, title: "item2")
    order.add_item(item1)
    order.add_item(item2)
    assert_equal 1, order.items.first.id
    assert_equal 2, order.items.last.id
  end

  test "adding item without a quantity creates an order item of quantity 1" do
    order = FactoryGirl.create(:order)
    item  = FactoryGirl.create(:item)
    order.add_item(item)
    assert_equal 1, order.order_items.count
    assert_equal 1, order.order_items.first.quantity
  end

  test "adding items with quantities creates order items with quantities" do
    order = FactoryGirl.create(:order)
    item1  = FactoryGirl.create(:item, title: "item1")
    item2  = FactoryGirl.create(:item, title: "item2")
    order.add_item(item1, 20)
    order.add_item(item2, 5)
    assert_equal 20, order.order_items.first.quantity
    assert_equal 5, order.order_items.last.quantity
  end

  test "adding  item that is already in cart increases order item quantity" do
    order = FactoryGirl.create(:order)
    item1  = FactoryGirl.create(:item)
    order.add_item(item1)
    order.add_item(item1, 5)
    assert_equal 6, order.order_items.first.quantity
  end

end
