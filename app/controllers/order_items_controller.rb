class OrderItemsController < ApplicationController
  include CurrentOrder

  before_action :set_order, only: :create

  def create
    set_order.add_item(params[:item_id])
    redirect_to items_path
  end

end
