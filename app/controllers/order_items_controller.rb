class OrderItemsController < ApplicationController

  respond_to :json, only: :create

  before_action :set_order, only: :create

  def create
    item_id = params[:order_item][:item_id]
    quantity = params[:order_item][:quantity]
    set_order.add_item(item_id, quantity)
    order_item = set_order.order_items.find_by(item_id: item_id)
    respond_to do |format|
      format.json do
        render json: {
          order_item: {
            id: order_item.id,
            quantity: order_item.quantity,
            subtotal: to_currency(order_item.subtotal)
          },
          item: {
            title: order_item.item.title,
            price: to_currency(order_item.item.price)
          },
          order: {
            total_items: set_order.total_items,
            subtotal: to_currency(set_order.subtotal)
          }
        }.to_json
      end
    end
  end

  def destroy
    order_item = OrderItem.find(params[:id])
    item = order_item.item.title
    order_item.destroy
    flash[:success] = "Removed #{item} from your Order."
    redirect_to menu_path
  end

  def update
    order_item = OrderItem.find(params[:id])
    order_item.quantity = params[:order_item][:quantity]
    order_item.save
    redirect_to order_path
  end

end
