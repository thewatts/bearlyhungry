class Admin::ItemsController < ApplicationController
  layout "admin"
  include Admin::ItemsHelper

  def index
    @items = current_restaurant.items
  end

  def new
    @item = current_restaurant.item.new
  end

  def show
  end

  def create
    item = current_restaurant.items.new(item_params)
    item.save
    redirect_to restaurant_admin_items_path(current_restaurant.slug)
  end

  def edit
    @item = Item.find(params[:id])
  end

  def update
    @item = current_restaurant.items.find(params[:id])
    if params[:item][:available] == '0'
      @item.available = false
    else
      @item.available = true
    end
    @item.save
    @item.update(item_params)
    redirect_to restaurant_admin_items_path(current_restaurant.slug)
  end

  def toggle_availability
    @item = Item.find(params[:item_id])
    @item.update(available: params[:available])
    flash.now[:success] = "Success!"
    redirect_to restaurant_admin_items_path(current_restaurant.slug)
  end

  def destroy
    item = Item.find(params[:id])
    item.destroy
    redirect_to restaurant_admin_items_path(current_restaurant.slug)
  end
end
