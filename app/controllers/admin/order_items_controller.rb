class Admin::OrderItemsController < ApplicationController

  def create
    # set_order.add_item(params[:item_id])
    redirect_to admin_order_path()
  end

  def destroy
    order_item = OrderItem.find(params[:id])
    order_item.destroy
    redirect_to admin_orders_path
  end

  def update
    order_item = OrderItem.find(params[:id])
    order_item.quantity = params[:order_item][:quantity]
    order_item.save
    redirect_to admin_order_index_path
  end
end
