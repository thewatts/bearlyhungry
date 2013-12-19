class Admin::OrdersController < ApplicationController
  layout "admin"

  def index
    @orders = Order.all.page(params[:page])
  end

  def new
    @order = Order.new
  end

  def edit
    @order = Order.find(params[:id])
  end

  def show
    @order = Order.find(params[:id])
  end

  def kitchen
    @orders = Order.all.find_by(status: "preparing").page(params[:page])
  end

  def destroy
    order = Order.find_by(id: params[:id])
    order.destroy
    order.save
    redirect_to admin_order_index_path
  end

  def update
    @order = Order.find(params[:id]) 
    current_order.update_status("completed")
  end
end
