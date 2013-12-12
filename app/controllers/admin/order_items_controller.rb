class Admin::OrderItemsController < ApplicationController
  layout "admin"
  def create
    # set_order.add_item(params[:item_id])
    redirect_to admin_order_path
  end

  def destroy
    order_item = OrderItem.find_by(id: params[:id])
    order_item.destroy
    redirect_to admin_order_path
  end

  def update
    order_item = OrderItem.find(params[:order_item_id])
    if order_item
      one = order_item.quantity
      order_item.quantity = params[:order_item][:quantity].to_i
      two = order_item.quantity
      
      order_item.save!
    end
    redirect_to admin_order_path
  end
end
