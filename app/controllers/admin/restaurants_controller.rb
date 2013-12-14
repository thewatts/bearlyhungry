class Admin::RestaurantsController < ApplicationController
  layout "admin"
  include Admin::ItemsHelper

  def index
    @restaurants = Restaurant.all
  end

  def show
    @restaurant = Restaurant.find_by(slug: params[:slug])
  end
end
