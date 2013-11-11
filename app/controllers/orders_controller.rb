
class OrdersController < ApplicationController

  def index
    # redirect_to order_path
  end

  def show
    @order = set_order
    if current_user
      @order.user_id = current_user.id
      @order.status = "in progress"
      @order.save
    end
  end

end
