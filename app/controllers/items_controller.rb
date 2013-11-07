class ItemsController < ApplicationController
  include CurrentOrder
  def index
    @current_order = set_order
    @items = Item.all
  end

  def new
    @item = Item.new
  end

  def create
    item = Item.new(item_attributes)
    item.save
    redirect_to items_path
  end


  def item_attributes
    params.require(:item)
          .permit(:title, :description, :price)
  end


end
