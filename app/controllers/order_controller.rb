class OrderController < ApplicationController
  # include CurrentOrder
  def show
    @order = set_order
    # @order_categories = @order.items.map {|i| i.categories.where(type_of: 'main_menu')}
  end
end
