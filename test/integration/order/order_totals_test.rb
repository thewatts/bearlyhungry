require './test/test_helper'

class OrderTest < ActiveSupport::TestCase

  test "getting order subtotal" do
    order  = FactoryGirl.create(:order)
    item1  = FactoryGirl.create(:item, title: "item1", price: 20.00)
    item2  = FactoryGirl.create(:item, title: "item2", price: 5.00)
    order.add_item(item1)
    order.add_item(item2)
    order.add_item(item2, 5)
    assert_equal 50.00, order.subtotal
  end

  test "getting order's total items" do
    order  = FactoryGirl.create(:order)
    item1  = FactoryGirl.create(:item, title: "item1")
    item2  = FactoryGirl.create(:item, title: "item2")
    item3  = FactoryGirl.create(:item, title: "item3")
    order.add_item(item1)
    order.add_item(item2)
    order.add_item(item2, 5)
    order.add_item(item1, 12)
    assert_equal 19, order.total_items
  end


end
