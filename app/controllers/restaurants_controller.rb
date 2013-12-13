class RestaurantsController < ApplicationController

  def new
    @restaurant = Restaurant.new
  end

  def show
    @restaurant = Restaurant.find_by_slug(params[:restaurant])
  end

end
