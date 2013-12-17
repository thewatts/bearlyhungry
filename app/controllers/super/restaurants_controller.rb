class Super::RestaurantsController < ApplicationController
  layout "super"

  def index
    @restaurants = Restaurant.all
  end

  def show
    @restaurant = Restaurant.find_by(:slug => params[:slug])
  end
end
