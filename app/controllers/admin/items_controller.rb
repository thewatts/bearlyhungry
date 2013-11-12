class Admin::ItemsController < ApplicationController

  include Admin::ItemsHelper

  def index
    @items = Item.all
  end

  # def show
  #   @item = Item.find(params[:id])
  # end

  # def show_by_category

  # end

  def new
    @item = Item.new
  end

  def create
    item = Item.new(item_params)
    item.save
    redirect_to admin_item_path(@item)
  end

  def edit
    @item = Item.find(params[:id])
  end

  def update
    @item = Item.find(params[:id])
    @item.update(item_params)
    redirect_to admin_item_path(@item)
  end

  def destroy
    @item = Item.find(params[:id])
    item.destroy
    redirect_to admin_item_path
  end
end
