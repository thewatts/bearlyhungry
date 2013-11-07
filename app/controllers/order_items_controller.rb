class OrderItemsController < ApplicationController
  include CurrentOrder

  before_action :set_order, only: :create

  def create
    @current_order.add_item(params[:item_id])
  end

end
