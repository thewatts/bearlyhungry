class Admin::ItemsController < ApplicationController
  layout "admin"
  include Admin::ItemsHelper

  def index
    @items = Item.all
  end

  def new
    @item = Item.new
  end

  def show

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
    if params[:item][:available] == '0'
      @item.available = false
    else
      @item.available = true
    end
    @item.save
    @item.update(item_params)
    redirect_to admin_items_path
  end

  def toggle_availability
    @item = Item.find(params[:item_id])
    @item.update(available: params[:available])
    flash.now[:success] = "Success!"
    redirect_to admin_items_path
  end

  def destroy
    item = Item.find(params[:id])
    item.destroy
    redirect_to admin_items_path
  end
end
