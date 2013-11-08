class ItemsController < ApplicationController
  include ItemsHelper
  include CurrentOrder


  def index
    @current_order
    @items = Item.all
  end

  def show
    @item = Item.find(params[:id])
  end

  def new
    @item = Item.new
  end

  def create
    item = Item.new(item_params)
    item.save
    redirect_to items_path(@item)
  end

  def edit
    @item = Item.find(params[:id])
  end

  def destroy
    @item = Item.find(params[:id])
    item.destroy
    redirect_to items_path
  end

  def update
    @item = Item.find(params[:id])
    @item.update(item_params)
    redirect_to items_path(@item)
  end
end


  # def item_attributes
  #   params.require(:item)
  #         .permit(:title, :description, :price)
  # end
