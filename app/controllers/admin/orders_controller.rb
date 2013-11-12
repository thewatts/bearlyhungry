class Admin::OrdersController < ApplicationController

  def index
    @status_counts = Order.count_by_status
    @orders = Order.all
  end

  def edit
    @order = Order.find(params[:id])
  end

  def destroy
    @order = Order.find_by(id: params[:id])
    @order.status = "cancelled"
    @order.save
    redirect_to admin_order_index_path
  end

end
