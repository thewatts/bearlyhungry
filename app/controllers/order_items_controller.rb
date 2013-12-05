class OrderItemsController < ApplicationController

  def create
    item_id  = params[:order_item][:item_id]
    quantity = params[:order_item][:quantity]
    current_order.add_item(item_id, quantity)
    item = Item.find(item_id)
    flash[:notice] = "Added #{item.title} to cart."
    redirect_to menu_path
  end

  def destroy
    order_item = current_order.order_items.find_by(id: params[:id])
    if order_item
      order_item.destroy
      flash[:success] = "Removed #{order_item.item.title} from your Order."
    else
      flash[:error] = "Sorry, something went wrong."
    end
    redirect_to menu_path
  end

  def update
    order_item = OrderItem.find(params[:id])
    order_item.quantity = params[:order_item][:quantity]
    order_item.save
    redirect_to order_path
  end

end
