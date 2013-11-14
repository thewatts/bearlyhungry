class OrdersController < ApplicationController

  def index
    if current_user
      @orders = current_user.past_orders
    else
      redirect_to current_order_path
    end
  end

  def show
    @order = Order.find(params[:id])
    # fail
    if current_user
      @order.user_id = current_user.id
      @order.status = "in progress"
      @order.save
    end

  end

  def update_current_order
    order = Order.find(params[:order_id])
    order.order_items.each do |order_item|
      if !order_item.item.available?
        flash.now[:item_error] = "Some items you selected are no longer available and were not added to your order."
      else
        set_order.add_item(order_item.item_id, order_item.quantity)
      end
    end
    flash.now[:notice] = "Your items have been added to your order."
    redirect_to my_orders_path
  end

  def current_order
    @order = set_order
  end

  def clear_order
    current_order.order_items.destroy_all
    redirect_to menu_path
  end


end
