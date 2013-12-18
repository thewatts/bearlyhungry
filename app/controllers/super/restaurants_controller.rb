class Super::RestaurantsController < ApplicationController
  layout "super"

  def index
    @restaurants = Restaurant.limit(5)
  end

  def show
    @restaurant = Restaurant.find_by(:slug => params[:slug])
  end

  def update
    restaurant = Restaurant.find_by(:slug => params[:slug])
    restaurant.update(status: params[:status])
    restaurant.email_response
    redirect_to :back
  end
end
