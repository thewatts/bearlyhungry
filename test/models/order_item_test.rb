require 'test_helper'

class OrderItemTest < ActiveSupport::TestCase

  test "must respond to :item" do
    order_item = FactoryGirl.create(:order_item)
    assert_respond_to order_item, :item
  end

  test "must respond to :order" do
    order_item = FactoryGirl.create(:order_item)
    assert_respond_to order_item, :order
  end

  test "is valid with quantity as a number" do
    order_item = FactoryGirl.build(:order_item, quantity: 1)
    assert order_item.save
  end

  test "quantity must be a number" do
    order_item = FactoryGirl.build(:order_item, quantity: "abc")
    refute order_item.save
  end

  test "quantity must be greater than 0" do
    order_item1 = FactoryGirl.build(:order_item, quantity: -1)
    order_item2 = FactoryGirl.build(:order_item, quantity: 0)
    refute order_item1.save
    refute order_item2.save
  end

end
