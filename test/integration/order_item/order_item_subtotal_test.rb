require 'test_helper'

class OrderItemTest < ActiveSupport::TestCase

  test "it has a subtotal" do
    item = FactoryGirl.create(:item, price: 5.00)
    order_item = FactoryGirl.create(:order_item, item_id: 1, quantity: 2)
    assert_equal 10.00, order_item.subtotal
  end

end
