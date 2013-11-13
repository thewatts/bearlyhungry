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
    if params[:item][:available] == '0'
      @item.available = false
    else
      @item.available = true
    end
    @item.save
    @item.update(item_params)
    redirect_to item_path
  end

  def destroy
    @item = Item.find(params[:id])
    item.destroy
    redirect_to admin_item_path
  end
end