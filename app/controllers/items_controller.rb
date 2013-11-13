class ItemsController < ApplicationController

  include ItemsHelper

  def index
    @category = Category.find_by_slug(params[:category])
    if params[:category] && !@category.nil?
      @items = @category.items.available
    else
      @items = Item.available
    end
  end

  def show
    @item = Item.find(params[:id])
    if !@item.available?
      flash.now[:item_error] = "This item is no longer available."
    end
  end

  def new
    @item = Item.new
  end

  def create
    item = Item.new(item_params)
    item.save
    redirect_to admin_items_path
  end

  def edit
    @item = Item.find(params[:id])
  end

  def update
    @item = Item.find(params[:id])
    @item.update(item_params)
    redirect_to admin_items_path
  end

  def destroy
    item = Item.find(params[:id])
    item.destroy
    redirect_to admin_items_path
  end


end

