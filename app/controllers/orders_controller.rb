class OrdersController < ApplicationController

  def index
    if current_user
      @orders = current_user.orders
    else
      redirect_to current_order_path
    end
  end

  def show
    @order = Order.find(set_order.id)
    # fail
    if current_user
      @order.user_id = current_user.id
      @order.status = "in progress"
      @order.save
    end

  end

  def update_current_order
    order_items = set_order.order_items
    fail
    redirect_to current_order_path
  end

  def current_order
    @order = set_order
  end


end
