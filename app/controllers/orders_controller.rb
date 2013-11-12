
class OrdersController < ApplicationController

  def index
    redirect_to current_order_path
  end

  def show
    @order = set_order
    if current_user
      @order.user_id = current_user.id
      @order.status = "in progress"
      @order.save
    end
  end

  def update
    order = Order.find(params[:id])
    order.user_id = params[:order][:user_id]
    order.status = params[:order][:status]
    order.save
    redirect_to admin_order_index_path
  end

end
