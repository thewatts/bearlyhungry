class Admin::OrdersController < ApplicationController
  layout "admin"

  def index
    if params[:status]
      @orders = Order.find_all_by_status(params[:status])
    else
      @status_counts = Order.count_by_status
      @orders = Order.all
    end
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
