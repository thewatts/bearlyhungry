class ItemsController < ApplicationController
  def index
    @items = Item.all
  end

  def new
    @item = Item.new
  end

  def create
    # fail
    item = Item.new(item_attributes)
    if item.save
      redirect_to items_path
    else
      fail
    end
  end


  def item_attributes
    params.require(:item)
          .permit(:title, :description, :price)
  end


end
