class OrderItemsController < ApplicationController

  before_action :set_order, only: :create

  def create
    set_order.add_item(params[:item_id])
    redirect_to items_path
  end

  def destroy
    order_item = OrderItem.find(params[:id])
    order_item.destroy
    redirect_to order_path
  end

  def update
    order_item = OrderItem.find(params[:id])
    order_item.quantity = params[:order_item][:quantity]
    order_item.save
    if current_user.admin?
      redirect_to admin_order_index_path
    else
      redirect_to order_path
    end
  end

end
