class OrderController < ApplicationController
  include CurrentOrder
  def show
    @order = set_order
  end
end
