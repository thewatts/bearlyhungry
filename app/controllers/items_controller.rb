class ItemsController < ApplicationController

  include ItemsHelper

  def index
    @category = Category.find_by(title: formatted_category(params[:category]))
    if params[:category] && !@category.nil?
      @items = @category.items
    else
      @items = Item.all
    end
  end

  def show
    @item = Item.find(params[:id])
  end

  # def show_by_category

  # end

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
    @item = Item.find(params[:id])
    item.destroy
    redirect_to admin_items_path
  end


end

